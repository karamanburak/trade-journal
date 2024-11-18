"use strict";

const Comment = require("../models/comment");
const Trade = require("../models/trade");

module.exports = {
  list: async (req, res) => {
    const data = await res.getModelList(Comment, {}, [
      { path: "userId", select: "username firstName lastName" },
    ]);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Comment, {}),
      data,
    });
  },
  create: async (req, res) => {
    const data = await Comment.create(req.body);

    const trade = await Trade.findById(req.body.tradeId);
    if (!trade) {
      return res.status(404).send({
        error: true,
        message: "Trade not found",
      });
    }
    trade.comments.push(data._id);
    await trade.save();

    res.status(201).send({
      error: false,
      message: "Comment successfully created",
      data,
    });
  },
  read: async (req, res) => {
    const data = await Comment.findOne({ _id: req.params.id }).populate(
      "userId",
      "username firstName lastName email"
    );
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    const data = await Comment.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
      new: true,
    });
    res.status(202).send({
      error: false,
      message: "Comment successfully updated",
      data,
      new: await Comment.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    const data = await Comment.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      message: data.deletedCount
        ? "Comment successfully deleted"
        : "Comment not found!",
      data,
    });
  },
};
