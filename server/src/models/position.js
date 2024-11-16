"use strict";

const { mongoose } = require("../configs/dbConnection");

const PositionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    stockSymbol: {
      type: String,
      required: true,
      upperCase: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
      min: 1,
    },
    averagePrice: {
      type: Number,
      required: true,
      default: 0,
    },
    totalInvestment: {
      type: Number,
      required: true,
      default: 0,
    },
    currentValue: {
      type: Number,
      default: 0,
    },
    openTrades: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Trade",
      },
    ],
  },
  {
    collection: "positions",
    timestamps: true,
  }
);

module.exports = mongoose.model("Position", PositionSchema);
