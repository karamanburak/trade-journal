"use strict";

const Deposit = require("../models/deposit");
const { CustomError } = require("../errors/customError");
const Account = require("../models/account");

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
        #swagger.summary = "Create a New Transaction (Deposit or Withdrawal)"
        #swagger.description = "Add a new transaction (deposit or withdrawal) and update the account balance"
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                accountId: "account-id",
                amount: 5000,
                transactionType: "DEPOSIT", // or "WITHDRAWAL"
                date: "2024-11-17",
            },
        }
        #swagger.responses[201] = {
            description: "Transaction created successfully",
            schema: {
                error: false,
                message: "Transaction added successfully",
                data: {
                    _id: "transaction-id",
                    accountId: "account-id",
                    userId: "user-id",
                    amount: 5000,
                    transactionType: "DEPOSIT",
                    date: "2024-11-17",
                },
            },
        }
        #swagger.responses[400] = {
            description: "Invalid input",
            schema: {
                error: true,
                message: "Amount, accountId, and transactionType are required",
            },
        }
    */
    const { amount, accountId, transactionType } = req.body;

    if (!amount || !accountId || !transactionType) {
      throw new CustomError("Amount and accountId are required", 400);
    }

    const amountNum = Number(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      throw new CustomError("Amount must be a positive number", 400);
    }

    if (!["DEPOSIT", "WITHDRAWAL"].includes(transactionType)) {
      throw new CustomError(
        "Invalid transaction type. Must be 'DEPOSIT' or 'WITHDRAWAL'",
        400
      );
    }

    const account = await Account.findById(accountId);

    if (!account) {
      throw new CustomError("Account not found", 404);
    }

    if (transactionType === "WITHDRAWAL") {
      if (account.totalValue < amountNum) {
        throw new CustomError("Insufficient balance", 400);
      }
      account.totalValue -= amountNum;
    } else if (transactionType === "DEPOSIT") {
      account.totalValue += amountNum;
    }

    await account.save();

    const newTransaction = await Deposit.create({
      ...req.body,
      userId: req.user._id,
    });

    res.status(201).json({
      error: false,
      message: "Transaction added successfully",
      data: newTransaction,
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
