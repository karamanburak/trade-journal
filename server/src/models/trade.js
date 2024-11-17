"use strict";

const { mongoose } = require("../configs/dbConnection");
const Trade = require("./trade");

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
    profitOrLoss: {
      type: Number,
      default: 0,
    },
    tradeDuration: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["OPEN", "COMPLETED", "CANCELLED"],
      default: "OPEN",
    },
  },

  {
    collection: "trades",
    timestamps: true,
  }
);

TradeSchema.pre("save", function (next) {
  if (this.isModified("status") && this.status === "COMPLETED") {
    const duration =
      (new Date(this.tradeDate) - new Date(this.createdAt)) /
      (1000 * 60 * 60 * 24);
    this.tradeDuration = Math.round(duration * 100) / 100;
  }
  next();
});

TradeSchema.post("save", async function () {
  if (this.status === "COMPLETED") {
    try {
      const Trade = mongoose.model("Trade");
      const trades = await Trade.find({
        userId: this.userId,
        status: "COMPLETED",
      });
      const totalProfit = trades.reduce(
        (sum, trade) => sum + (trade.profitOrLoss || 0),
        0
      );
      const winRate =
        (trades.filter((trade) => trade.profitOrLoss > 0).length /
          trades.length) *
        100;

      await mongoose
        .model("Account")
        .findOneAndUpdate(
          { userId: this.userId },
          { $set: { totalProfit, winRate } },
          { upsert: true }
        );
    } catch (err) {
      console.error("Performance metrics update failed:", err);
    }
  }
});

module.exports = mongoose.model("Trade", TradeSchema);
