"use strict";

const Account = require("../models/account");
const { CustomError } = require("../errors/customError");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Account, {}, [
      {
        path: "userId",
      },
      {
        path: "tradeId",
      },
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Account, {}),
      data,
    });
  },
  create: async (req, res) => {
    const newAccount = await Account.create(req.body);

    res.status(201).send({
      error: false,
      data: newAccount,
    });
  },
  read: async (req, res) => {
    const data = await Account.findById(req.params.id);
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    const updatedAccount = await Account.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedAccount) {
      throw new CustomError("Account not found", 404);
    }
    res.status(202).send({
      error: false,
      message: "Account updated successfully",
      data: updatedAccount,
    });
  },
  delete: async (req, res) => {
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
