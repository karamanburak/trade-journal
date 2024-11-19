"use strict";

const { mongoose } = require("../configs/dbConnection");

const PositionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    stockId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
      required: true,
    },
    symbol: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    totalQuantity: {
      type: Number,
      required: true,
      default: 0,
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
  },
  {
    collection: "positions",
    timestamps: true,
  }
);

module.exports = mongoose.model("Position", PositionSchema);
