"use strict";

const { mongoose } = require("../configs/dbConnection");

const NoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tradeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trade",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    collection: "notes",
    timestamps: true,
  }
);

module.exports = mongoose.model("Note", NoteSchema);
