"use strict";

const Account = require("../models/account");
const { CustomError } = require("../errors/customError");

module.exports = {
  list: async (req, res) => {
    /*
        #swagger.tags = ["Account"]
        #swagger.summary = "Get List of Accounts"
        #swagger.description = "Fetch a list of all accounts"
        #swagger.responses[200] = {
            description: "Accounts fetched successfully",
            schema: {
                error: false,
                details: {
                    totalCount: 100,
                    // Additional details...
                },
                data: [
                    {
                        _id: "account-id",
                        userId: "user-id",
                        tradeId: "trade-id",
                        balance: 1000,
                        // Other fields...
                    }
                ]
            }
        }
    */
    const data = await res.getModelList(Account, {}, [
      {
        path: "userId",
      },
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Account, {}),
      data,
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags = ["Account"]
        #swagger.summary = "Create a New Account"
        #swagger.description = "Create a new account entry"
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                userId: "user-id",
                tradeId: "trade-id",
                balance: 1000,
                // Other fields...
            }
        }
        #swagger.responses[201] = {
            description: "Account created successfully",
            schema: {
                error: false,
                data: {
                    _id: "account-id",
                    userId: "user-id",
                    tradeId: "trade-id",
                    balance: 1000,
                    // Other fields...
                }
            }
        }
    */
    const newAccount = await Account.create(req.body);

    res.status(201).send({
      error: false,
      data: newAccount,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Account"]
        #swagger.summary = "Get Account Details"
        #swagger.description = "Fetch details of a single account by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the account to fetch"
        }
        #swagger.responses[200] = {
            description: "Account details fetched successfully",
            schema: {
                error: false,
                data: {
                    _id: "account-id",
                    userId: "user-id",
                    tradeId: "trade-id",
                    balance: 1000,
                    // Other fields...
                }
            }
        }
    */
    const data = await Account.findOne({ _id: req.params.id });

    if (!data) {
      throw new CustomError("Account not found", 404);
    }

    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
        #swagger.tags = ["Account"]
        #swagger.summary = "Update an Account"
        #swagger.description = "Update an existing account by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the account to update"
        }
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                balance: 1200,
                // Other fields...
            }
        }
        #swagger.responses[202] = {
            description: "Account updated successfully",
            schema: {
                error: false,
                message: "Account updated successfully",
                data: {
                    _id: "account-id",
                    userId: "user-id",
                    tradeId: "trade-id",
                    balance: 1200,
                    // Other fields...
                }
            }
        }
        #swagger.responses[404] = {
            description: "Account not found",
            schema: {
                error: true,
                message: "Account not found"
            }
        }
    */
    const { transactionType, totalValue } = req.body;

    if (transactionType !== "deposit" && transactionType !== "withdrawal") {
      return res.status(400).send({
        error: true,
        message: "Invalid transaction type. Use 'deposit' or 'withdrawal'.",
      });
    }

    if (transactionType === "withdrawal" && totalValue <= 0) {
      return res.status(400).send({
        error: true,
        message: "Withdrawal amount must be greater than zero.",
      });
    }

    const updateQuery =
      transactionType === "deposit"
        ? { $inc: { totalValue } }
        : transactionType === "withdrawal"
        ? { $inc: { totalValue: -totalValue } }
        : {};

    const updatedAccount = await Account.findOneAndUpdate(
      { userId: req.body.userId },
      updateQuery,
      { new: true }
    );

    if (!updatedAccount) {
      throw new CustomError("Account not found for the given userId", 404);
    }

    res.status(202).send({
      error: false,
      message: "Account updated successfully",
      data: updatedAccount,
    });
  },
  delete: async (req, res) => {
    /*
        #swagger.tags = ["Account"]
        #swagger.summary = "Delete an Account"
        #swagger.description = "Delete an account by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the account to delete"
        }
        #swagger.responses[204] = {
            description: "Account deleted successfully",
            schema: {
                error: false,
                message: "Account deleted successfully"
            }
        }
        #swagger.responses[404] = {
            description: "Account not found",
            schema: {
                error: true,
                message: "Account not found"
            }
        }
    */
    const data = await Account.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
      message: data.deletedCount
        ? "Account deleted successfully"
        : "Account not found",
    });
  },
};
