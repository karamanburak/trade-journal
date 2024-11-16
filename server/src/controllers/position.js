"use strict";

const Position = require("../models/position");
const { CustomError } = require("../errors/customError");

module.exports = {
  list: async (req, res) => {
    /*
        #swagger.tags = ["Position"]
        #swagger.summary = "Get List of Positions"
        #swagger.description = "Fetch a list of all positions, including related open trades"
        #swagger.responses[200] = {
            description: "Positions fetched successfully",
            schema: {
                error: false,
                details: {
                    totalCount: 100,
                    // More details...
                },
                data: [
                    {
                        _id: "position-id",
                        stockSymbol: "AAPL",
                        quantity: 100,
                        averagePrice: 150,
                        totalInvestment: 15000,
                        currentValue: 16000,
                        openTrades: [
                            {
                                stockSymbol: "AAPL",
                                quantity: 50,
                                price: 145,
                                executionDate: "2024-11-15",
                            },
                        ],
                    },
                ],
            },
        }
    */
    const data = await res.getModelList(Position, {}, [
      {
        path: "openTrades",
        select: "stockSymbol quantity price executionDate",
      },
    ]);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Position, {}),
      data,
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags = ["Position"]
        #swagger.summary = "Create a New Position"
        #swagger.description = "Create a new position for a specific stock"
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                stockSymbol: "AAPL",
                quantity: 100,
                price: 150,
            },
        }
        #swagger.responses[201] = {
            description: "Position created successfully",
            schema: {
                status: "success",
                data: {
                    _id: "position-id",
                    userId: "user-id",
                    stockSymbol: "AAPL",
                    quantity: 100,
                    averagePrice: 150,
                    totalInvestment: 15000,
                    currentValue: 15000,
                },
            },
        }
        #swagger.responses[400] = {
            description: "Position already exists",
            schema: {
                error: true,
                message: "Position already exists",
            },
        }
    */

    // console.log(req.user);
    const { stockSymbol, quantity, averagePrice } = req.body;

    const formattedStockSymbol = stockSymbol.toUpperCase();

    // Check if quantity and price (averagePrice) are provided
    if (!quantity || !averagePrice) {
      throw new CustomError("Quantity and price are required", 400);
    }

    // Trim and convert to number
    const trimmedQuantity = quantity?.trim();
    const trimmedPrice = averagePrice?.trim();

    const quantityNum = Number(trimmedQuantity);
    const priceNum = Number(trimmedPrice);

    // Check if the quantity and price are valid numbers
    if (isNaN(quantityNum) || isNaN(priceNum)) {
      throw new CustomError("Quantity or price is invalid", 400);
    }

    // Check if the position already exists
    const existingPosition = await Position.findOne({
      userId: req.user._id,
      stockSymbol: formattedStockSymbol,
    });

    if (existingPosition) {
      throw new CustomError("Position already exists", 400);
    }

    // Calculate total investment
    const totalInvestment = quantityNum * priceNum;

    const newPosition = await Position.create({
      userId: req.user._id,
      stockSymbol: formattedStockSymbol,
      quantity: quantityNum,
      averagePrice: priceNum,
      totalInvestment,
      currentValue: totalInvestment,
    });

    res.status(201).json({
      error: false,
      message: "Position created successfully",
      data: newPosition,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Position"]
        #swagger.summary = "Get Position Details"
        #swagger.description = "Fetch details of a single position by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the position to fetch",
        }
        #swagger.responses[200] = {
            description: "Position details fetched successfully",
            schema: {
                error: false,
                data: {
                    _id: "position-id",
                    stockSymbol: "AAPL",
                    quantity: 100,
                    averagePrice: 150,
                    totalInvestment: 15000,
                    currentValue: 16000,
                    openTrades: [
                        {
                            stockSymbol: "AAPL",
                            quantity: 50,
                            price: 145,
                            executionDate: "2024-11-15",
                        },
                    ],
                },
            },
        }
        #swagger.responses[404] = {
            description: "Position not found",
            schema: {
                error: true,
                message: "Position not found",
            },
        }
    */
    const data = await Position.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("openTrades");
    if (!data) {
      throw new CustomError("Position not found", 404);
    }
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
        #swagger.tags = ["Position"]
        #swagger.summary = "Update a Position"
        #swagger.description = "Update an existing position by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the position to update",
        }
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                quantity: 150,
                price: 155,
            },
        }
        #swagger.responses[202] = {
            description: "Position updated successfully",
            schema: {
                error: false,
                message: "Position updated successfully",
                data: {
                    _id: "position-id",
                    stockSymbol: "AAPL",
                    quantity: 150,
                    averagePrice: 155,
                    totalInvestment: 23250,
                    currentValue: 23250,
                },
            },
        }
        #swagger.responses[404] = {
            description: "Position not found",
            schema: {
                error: true,
                message: "Position not found",
            },
        }
    */
    const { quantity, price } = req.body;

    const quantityNum = Number(quantity);
    const priceNum = Number(price);

    // Check if the quantity and price are valid numbers
    if (isNaN(quantityNum) || isNaN(priceNum)) {
      return res.status(400).json({
        error: true,
        message: "Invalid quantity or price. Both must be valid numbers.",
      });
    }

    const position = await Position.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!position) {
      throw new CustomError("Position not found", 404);
    }

    const newTotalInvestment = quantityNum * priceNum;

    const updatedPosition = await Position.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user._id,
      },
      {
        quantity: quantityNum,
        averagePrice: priceNum,
        totalInvestment: newTotalInvestment,
        currentValue: newTotalInvestment,
      },
      { new: true, runValidators: true }
    );
    res.status(202).send({
      error: false,
      message: "Position updated successfully",
      data: updatedPosition,
    });
  },
  delete: async (req, res) => {
    /*
        #swagger.tags = ["Position"]
        #swagger.summary = "Delete a Position"
        #swagger.description = "Delete a position by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the position to delete",
        }
        #swagger.responses[204] = {
            description: "Position deleted successfully",
            schema: {
                error: false,
                message: "Position successfully deleted!",
            },
        }
        #swagger.responses[404] = {
            description: "Position not found",
            schema: {
                error: true,
                message: "Position not found!",
            },
        }
    */
    const data = await Position.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
      message: data.deletedCount
        ? "Position successfully deleted!"
        : "Position not found!",
    });
  },
};
