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
    tradeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trade",
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    comments: {
      type: String,
      trim: true,
    },
    profitOrLoss: {
      type: Number,
      required: true,
      default: 0,
    },
    tradeDuration: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    collection: "accounts",
    timestamps: true,
  }
);

module.exports = mongoose.model("Account", AccountSchema);
