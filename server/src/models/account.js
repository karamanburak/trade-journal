"use strict";

const { mongoose } = require("../configs/dbConnection");

const AccountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    totalValue: {
      type: Number,
      default: 0,
    },
    completedTransactions: {
      type: Number,
      default: 0,
    },
    winRate: {
      type: Number,
      default: 0,
    },
    profitFactor: {
      type: Number,
      default: 0,
    },
    avarageProfit: {
      type: Number,
      default: 0,
    },
    avarageLoss: {
      type: Number,
      default: 0,
    },
    avarageHoldDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    collection: "accounts",
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", AccountSchema);
