"use strict";

const { mongoose } = require("../configs/dbConnection");

const CapitalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    collection: "capitals",
    timestamps: true,
  }
);

module.exports = mongoose.model("Capital", CapitalSchema);
