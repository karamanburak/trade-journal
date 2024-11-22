"use strict";

const Trade = require("../models/trade");
const Position = require("../models/position");
const User = require("../models/user");
const Account = require("../models/account");
const { CustomError } = require("../errors/customError");
const { getTradeCreatedEmailHtml } = require("../configs/email/trade/trade");
const { sendEmail } = require("../configs/email/emailService");
const {
  calculateMovingAverage,
  calculateWinRate,
  calculateProfitFactor,
  calculateAverageHoldDuration,
  calculateLossRate,
} = require("../helpers/calculateRates");

module.exports = {
  list: async (req, res) => {
    /*
        #swagger.tags = ["Trade"]
        #swagger.summary = "Get List of Trades"
        #swagger.description = "Fetch a list of all trades"
        #swagger.responses[200] = {
            description: "Trades fetched successfully",
            schema: {
                error: false,
                details: {
                    totalCount: 100,
                    // More details...
                },
                data: [
                    {
                        _id: "trade-id",
                        name: "Sample Trade",
                        description: "Details of the trade",
                        // Other fields...
                    }
                ]
            }
        }
    */
    const data = await res.getModelList(Trade, {}, [
      {
        path: "userId",
      },
      {
        path: "stockId",
      },
      {
        path: "comments",
      },
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Trade, {}),
      data,
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags = ["Trade"]
        #swagger.summary = "Create a New Trade"
        #swagger.description = "Create a new trade and send a notification email to the user"
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                name: "Sample Trade",
                description: "Details about the trade",
                userId: "user-id",
                // Other fields...
            }
        }
        #swagger.responses[201] = {
            description: "Trade created successfully",
            schema: {
                error: false,
                message: "Trade created successfully",
                data: {
                    _id: "trade-id",
                    name: "Sample Trade",
                    description: "Details of the trade",
                    // Other fields...
                }
            }
        }
        #swagger.responses[404] = {
            description: "User not found",
            schema: {
                error: true,
                message: "User not found. Cannot send notification email."
            }
        }
    */

    const { userId, stockId, symbol, quantity, price, transactionType } =
      req.body;

    if (
      !userId ||
      !stockId ||
      !symbol ||
      !quantity ||
      !price ||
      !transactionType
    ) {
      return res.status(400).send({
        error: true,
        message: "Missing required fields in request body.",
      });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        error: true,
        message: "User not found. Cannot proceed with the trade.",
      });
    }

    const account = await Account.findOne({ userId });
    if (!account) {
      return res.status(400).send({
        error: true,
        message:
          "User does not have an associated account. Cannot create trade.",
      });
    }

    const requiredValue = quantity * price;
    let newTrade;
    const existingTrade = await Trade.findOne({
      userId,
      symbol,
      transactionType,
    });

    if (transactionType === "BUY") {
      if (account.totalValue < requiredValue) {
        return res.status(400).send({
          error: true,
          message: `Insufficient funds to complete the trade. `,
        });
      }

      let position = await Position.findOneAndUpdate(
        { userId, symbol },
        {
          $set: {
            totalQuantity: newQuantity,
            totalInvestment: newTotalInvestment,
            averagePrice: newAveragePrice,
            entryPrice: price,
          },
        },
        { new: true }
      );

      const newQuantity = position.totalQuantity + quantity;
      const newTotalInvestment = position.totalInvestment + quantity * price;
      const newAveragePrice = newTotalInvestment / newQuantity;

      position.totalQuantity = newQuantity;
      position.totalInvestment = newTotalInvestment;
      position.averagePrice = newAveragePrice;
      await position.save();

      account.totalValue -= requiredValue;
      await account.save();

      if (existingTrade) {
        existingTrade.quantity += quantity;
        existingTrade.price = newAveragePrice;
        existingTrade.transactionDate = new Date();
        await existingTrade.save();
        newTrade = existingTrade;
      } else {
        newTrade = new Trade({
          userId,
          stockId,
          symbol,
          quantity,
          price,
          transactionType: "BUY",
          status: "OPEN",
        });
        await newTrade.save();
      }
    } else if (transactionType === "SELL") {
      const position = await Position.findOne({ userId, symbol });
      console.log(position);

      if (!position) {
        return res.status(400).send({
          error: true,
          message: `You don't have any ${symbol} shares in your portfolio. Please make a purchase first.`,
        });
      }

      if (position.totalQuantity < quantity) {
        return res.status(400).send({
          error: true,
          message: `Insufficient shares. You only have ${position.totalQuantity} shares of ${symbol} in your portfolio.`,
        });
      }

      const saleProceeds = quantity * price;
      const profitOrLoss = (price - position.averagePrice) * quantity;
      const tradeDuration =
        (new Date() - new Date(position.createdAt)) / (1000 * 60 * 60 * 24);

      position.totalQuantity -= quantity;
      position.totalInvestment -= quantity * position.averagePrice;

      await position.save();

      newTrade = new Trade({
        userId,
        stockId,
        symbol,
        quantity,
        price,
        transactionType: "SELL",
        profitOrLoss,
        tradeDuration: Math.round(tradeDuration * 100) / 100,
        status: "CLOSED",
        exitPrice: price,
      });
      await newTrade.save();

      if (position.totalQuantity === 0) {
        await Position.deleteOne({ userId, symbol });
      }

      account.completedTransactions += 1;
      account.totalValue += saleProceeds;

      if (profitOrLoss > 0) {
        account.profitableTrades = (account.profitableTrades || 0) + 1;
        account.avarageProfit = calculateMovingAverage(
          account.avarageProfit,
          profitOrLoss,
          account.completedTransactions
        );
      } else if (profitOrLoss < 0) {
        account.losingTrades = (account.losingTrades || 0) + 1;
        account.avarageLoss = calculateMovingAverage(
          account.avarageLoss,
          profitOrLoss,
          account.completedTransactions
        );
      }

      account.winRate = calculateWinRate(account);
      account.lossRate = calculateLossRate(account);
      account.profitFactor = calculateProfitFactor(account);
      account.avarageHoldDuration = calculateAverageHoldDuration(
        account.avarageHoldDuration,
        newTrade.tradeDuration,
        account.completedTransactions
      );

      await account.save();
    }

    const emailSubject = "New Trade Created!";
    const emailHtml = getTradeCreatedEmailHtml(user.firstName, newTrade || {}, {
      totalValue: account.totalValue,
    });
    await sendEmail(user.email, emailSubject, emailHtml);

    return res.status(201).send({
      error: false,
      message: "Trade created successfully",
      data: newTrade,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Trade"]
        #swagger.summary = "Get Trade Details"
        #swagger.description = "Fetch details of a single trade by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the trade to fetch"
        }
        #swagger.responses[200] = {
            description: "Trade details fetched successfully",
            schema: {
                error: false,
                data: {
                    _id: "trade-id",
                    name: "Sample Trade",
                    description: "Details of the trade",
                    // Other fields...
                }
            }
        }
    */
    const data = await Trade.findOne({ _id: req.params.id });

    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
        #swagger.tags = ["Trade"]
        #swagger.summary = "Update a Trade"
        #swagger.description = "Update an existing trade by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the trade to update"
        }
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                name: "Updated Trade Name",
                description: "Updated details of the trade",
                // Other fields...
            }
        }
        #swagger.responses[202] = {
            description: "Trade updated successfully",
            schema: {
                error: false,
                message: "Trade updated successfully",
                data: {
                    _id: "trade-id",
                    name: "Updated Trade Name",
                    description: "Updated details of the trade",
                    // Other fields...
                }
            }
        }
        #swagger.responses[404] = {
            description: "Trade not found",
            schema: {
                error: true,
                message: "Trade not found"
            }
        }
    */
    const updatedTrade = await Trade.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        runValidators: true,
        new: true,
      }
    );
    if (!updatedTrade) {
      throw new CustomError("Trade not found", 404);
    }

    res.status(202).send({
      error: false,
      message: "Trade updated successfully",
      data: updatedTrade,
    });
  },
  delete: async (req, res) => {
    /*
        #swagger.tags = ["Trade"]
        #swagger.summary = "Delete a Trade"
        #swagger.description = "Delete a trade by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the trade to delete"
        }
        #swagger.responses[204] = {
            description: "Trade deleted successfully",
            schema: {
                error: false,
                message: "Trade successfully deleted!"
            }
        }
        #swagger.responses[404] = {
            description: "Trade not found",
            schema: {
                error: true,
                message: "Trade not found!"
            }
        }
    */
    const data = await Trade.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
      message: data.deletedCount
        ? "Trade successfully deleted!"
        : "Trade not found!",
    });
  },
};
