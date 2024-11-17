"use strict";

const { mongoose } = require("../configs/dbConnection");

const DepositSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    transactionType: {
      type: String,
      enum: ["DEPOSIT", "WITHDRAWAL"],
      required: true,
    },
    status: {
      type: String,
      enum: ["COMPLETED", "PENDING", "FAILED"],
      default: "COMPLETED",
    },
  },
  {
    collection: "deposits",
    timestamps: true,
  }
);

module.exports = mongoose.model("Deposit", DepositSchema);
