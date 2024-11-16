"use strict";

const { mongoose } = require("../configs/dbConnection");

const TradeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    stockSymbol: {
      type: String,
      trim: true,
      uppercase: true,
      required: true,
    },
    tradeDate: {
      type: Date,
      default: Date.now,
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
    type: {
      type: String,
      enum: ["BUY", "SELL"],
      required: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "COMPLETED", "CANCELLED"],
      default: "OPEN",
    },
    executionDate: {
      type: Date,
      default: Date.now,
    },
    closingDate: {
      type: Date,
    },
    holdingPeriod: {
      type: Number,
      default: 0,
    },
    profitLoss: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    comments: [
      {
        text: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    lessons: {
      type: String,
      trim: true,
    },
  },

  {
    collection: "trades",
    timestamps: true,
  }
);
module.exports = mongoose.model("Trade", TradeSchema);
