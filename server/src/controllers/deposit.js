"use strict";

const Deposit = require("../models/deposit");
const { CustomError } = require("../errors/customError");

module.exports = {
  list: async (req, res) => {
    /*
        #swagger.tags = ["Deposit"]
        #swagger.summary = "Get List of Deposits"
        #swagger.description = "Fetch a list of all deposit transactions"
        #swagger.responses[200] = {
            description: "Deposits fetched successfully",
            schema: {
                error: false,
                details: {
                    totalCount: 100,
                },
                data: [
                    {
                        _id: "deposit-id",
                        userId: "user-id",
                        amount: 5000,
                        date: "2024-11-17",
                    },
                ],
            },
        }
    */
    const data = await res.getModelList(Deposit, { userId: req.user._id }, []);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Deposit, { userId: req.user._id }),
      data,
    });
  },

  create: async (req, res) => {
    /*
        #swagger.tags = ["Deposit"]
        #swagger.summary = "Create a New Deposit"
        #swagger.description = "Add a new deposit transaction to the user's account"
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                amount: 5000,
                date: "2024-11-17",
            },
        }
        #swagger.responses[201] = {
            description: "Deposit created successfully",
            schema: {
                error: false,
                message: "Deposit added successfully",
                data: {
                    _id: "deposit-id",
                    userId: "user-id",
                    amount: 5000,
                    date: "2024-11-17",
                },
            },
        }
        #swagger.responses[400] = {
            description: "Invalid input",
            schema: {
                error: true,
                message: "Amount and date are required",
            },
        }
    */
    const { amount } = req.body;

    if (!amount) {
      throw new CustomError("Amount is required", 400);
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new CustomError("Amount must be a positive number", 400);
    }

    const newDeposit = await Deposit.create(req.body);

    res.status(201).json({
      error: false,
      message: "Deposit added successfully",
      data: newDeposit,
    });
  },

  read: async (req, res) => {
    /*
        #swagger.tags = ["Deposit"]
        #swagger.summary = "Get Deposit Details"
        #swagger.description = "Fetch details of a single deposit by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the deposit to fetch",
        }
        #swagger.responses[200] = {
            description: "Deposit details fetched successfully",
            schema: {
                error: false,
                data: {
                    _id: "deposit-id",
                    userId: "user-id",
                    amount: 5000,
                    date: "2024-11-17",
                },
            },
        }
        #swagger.responses[404] = {
            description: "Deposit not found",
            schema: {
                error: true,
                message: "Deposit not found",
            },
        }
    */
    const data = await Deposit.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });
    if (!data) {
      throw new CustomError("Deposit not found", 404);
    }

    res.status(200).send({
      error: false,
      data,
    });
  },

  delete: async (req, res) => {
    /*
        #swagger.tags = ["Deposit"]
        #swagger.summary = "Delete a Deposit"
        #swagger.description = "Delete a deposit transaction by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the deposit to delete",
        }
        #swagger.responses[204] = {
            description: "Deposit deleted successfully",
            schema: {
                error: false,
                message: "Deposit successfully deleted!",
            },
        }
        #swagger.responses[404] = {
            description: "Deposit not found",
            schema: {
                error: true,
                message: "Deposit not found",
            },
        }
    */
    const data = await Deposit.deleteOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      message: data.deletedCount
        ? "Deposit successfully deleted!"
        : "Deposit not found",
    });
  },
};
