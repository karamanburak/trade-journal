"use strict";

const { mongoose } = require("../configs/dbConnection");
const Trade = require("./trade");

const TradeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    symbol: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 1,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    transactionDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["OPEN", "CLOSED", "PENDING"],
      default: "OPEN",
    },
    profitOrLoss: {
      type: Number,
      default: 0,
    },
    tradeDuration: {
      type: Number,
      default: 0,
    },
    entryPrice: {
      type: Number,
      default: 0,
    },
    exitPrice: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },

  {
    collection: "trades",
    timestamps: true,
  }
);

module.exports = mongoose.model("Trade", TradeSchema);
