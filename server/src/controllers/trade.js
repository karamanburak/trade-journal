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
      data: data.map((trade) => ({
        ...trade._doc,
        profitOrLoss: trade.profitOrLoss || 0,
        tradeDuration: trade.tradeDuration || 0,
      })),
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
    // req.body.userId = req.user?._id;

    // if (req.file) {
    //   const image = "/uploads/" + req.file.filename;
    //   req.body.image = req.body.image || image;
    // }

    const { userId, stockId, symbol, quantity, price, transactionType } =
      req.body;

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({
        error: true,
        message: "User not found. Cannot proceed with the trade.",
      });
    }

    const account = await Account.findOne({ userId: userId });
    if (!account) {
      return res.status(400).send({
        error: true,
        message:
          "User does not have an associated account. Cannot create trade.",
      });
    }

    const requiredValue = quantity * price;

    let newTrade = null;

    const existingTrade = await Trade.findOne({
      userId,
      symbol,
      transactionType,
    });

    if (transactionType === "BUY") {
      if (account.totalValue < requiredValue) {
        return res.status(400).send({
          error: true,
          message: "Insufficient funds to buy the stock.",
        });
      }

      // Find or create a position
      let position = await Position.findOne({ userId, symbol });

      if (!position) {
        // Create new position if doesn't exist
        position = new Position({
          userId,
          symbol,
          stockId,
          totalQuantity: 0,
          totalInvestment: 0,
          averagePrice: 0,
        });
      }

      // Calculate new position details
      const newQuantity = position.totalQuantity + quantity;
      const newTotalInvestment = position.totalInvestment + quantity * price;
      const newAveragePrice = newTotalInvestment / newQuantity;

      // Update position
      position.totalQuantity = newQuantity;
      position.totalInvestment = newTotalInvestment;
      position.averagePrice = newAveragePrice;
      await position.save();

      // Update account
      account.totalValue -= requiredValue;
      await account.save();

      // Handle trade creation or update
      if (existingTrade) {
        // Update existing trade for the same stock
        existingTrade.quantity += quantity;
        existingTrade.price = newAveragePrice;
        existingTrade.transactionDate = new Date();
        await existingTrade.save();
      } else {
        // Create new trade for a different stock
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
      // Find existing position
      const position = await Position.findOne({ userId, symbol });

      if (!position || position.totalQuantity < quantity) {
        return res.status(400).send({
          error: true,
          message: `Insufficient stock quantity. User has ${position.totalQuantity} shares of ${symbol} left. Cannot sell the remaining shares.`,
        });
      }

      // Calculate sale proceeds and profit/loss
      const saleProceeds = quantity * price;
      const profitOrLoss = (price - position.averagePrice) * quantity;
      const tradeDuration =
        (new Date() - new Date(position.createdAt)) / (1000 * 60 * 60 * 24);

      // Update position
      position.totalQuantity -= quantity;
      position.totalInvestment -= quantity * position.averagePrice;

      if (position.totalQuantity === 0) {
        await position.deleteOne({ _id: position._id });
      } else {
        await position.save();
      }

      // Create new trade for sell transaction
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
      });
      await newTrade.save();

      // Update account metrics
      account.completedTransactions += 1;
      account.totalValue += saleProceeds;

      // Update profit/loss calculations
      if (profitOrLoss > 0) {
        account.avarageProfit = calculateMovingAverage(
          account.avarageProfit,
          profitOrLoss,
          account.completedTransactions
        );
      } else {
        account.avarageLoss = calculateMovingAverage(
          account.avarageLoss,
          Math.abs(profitOrLoss),
          account.completedTransactions
        );
      }

      account.winRate = calculateWinRate(account);
      account.profitFactor = calculateProfitFactor(account);
      account.avarageHoldDuration = calculateAverageHoldDuration(
        account.avarageHoldDuration,
        newTrade.tradeDuration,
        account.completedTransactions
      );

      await account.save();
    }

    // Send notification email
    const emailSubject = "New Trade Created!";
    const emailHtml = getTradeCreatedEmailHtml(
      user.firstName,
      newTrade,
      account
    );
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
    const data = await Trade.findById(req.params.id);

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
