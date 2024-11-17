"use strict";

const Trade = require("../models/trade");
const Position = require("../models/position");
const User = require("../models/user");
const { CustomError } = require("../errors/customError");
const { getTradeCreatedEmailHtml } = require("../configs/email/trade/trade");
const { sendEmail } = require("../configs/email/emailService");

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
        select: "username firstName lastName email",
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

    const { userId, stockSymbol, quantity, price, type } = req.body;

    const newTrade = await Trade.create(req.body);

    const user = await User.findById(req.body.userId);
    if (!user) {
      return res.status(404).send({
        error: true,
        message: "User not found. Cannot send notification email.",
      });
    }

    const position = await Position.findOne({ userId, stockSymbol });

    if (type === "BUY") {
      if (position) {
        const totalQuantity = position.quantity + quantity;
        position.averagePrice =
          (position.quantity * position.averagePrice + quantity * price) /
          totalQuantity;
        position.quantity = totalQuantity;
        await position.save();
      } else {
        await Position.create({
          userId,
          stockSymbol,
          quantity,
          averagePrice: price,
        });
      }
    } else if (type === "SELL") {
      if (!position || position.quantity < quantity) {
        return res.status(400).send({
          error: true,
          message: "Insufficient quantity in position to sell",
        });
      }

      const profitOrLoss = (price - position.averagePrice) * quantity;

      const tradeDuration =
        (new Date() - new Date(position.createdAt)) / (1000 * 60 * 60 * 24);

      newTrade.tradeDuration = Math.round(tradeDuration * 100) / 100;

      position.quantity -= quantity;
      if (position.quantity === 0) {
        await position.remove();
      } else {
        await position.save();
      }

      newTrade.profitOrLoss = profitOrLoss;
      newTrade.tradeDuration = Math.round(tradeDuration * 100) / 100;
      newTrade.status = "COMPLETED";
      // console.log("Saving new trade with tradeDuration:", newTrade);
      await newTrade.save();
    }

    // Send email notification for new trade to user
    const emailSubject = "New Trade Created!";
    const emailHtml = getTradeCreatedEmailHtml(user.firstName, newTrade);
    await sendEmail(user.email, emailSubject, emailHtml);

    res.status(201).send({
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
