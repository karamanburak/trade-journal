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

NoteSchema.pre("deleteOne", async function (next) {
  try {
    const noteId = this.getQuery()._id;
    await mongoose
      .model("Trade")
      .updateMany({ notes: noteId }, { $pull: { notes: noteId } });
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Note", NoteSchema);
