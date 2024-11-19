"use strict";

const Comment = require("../models/comment");
const Trade = require("../models/trade");

module.exports = {
  list: async (req, res) => {
    /*
        #swagger.tags = ["Comment"]
        #swagger.summary = "Get List of Comments"
        #swagger.description = "Fetch a list of all comments"
        #swagger.responses[200] = {
            description: "Comments fetched successfully",
            schema: {
                error: false,
                details: {
                    totalCount: 100,
                    // More details...
                },
                data: [
                    {
                        _id: "comment-id",
                        text: "This is a comment",
                        userId: {
                            _id: "user-id",
                            username: "JohnDoe",
                            firstName: "John",
                            lastName: "Doe",
                        },
                        tradeId: "trade-id",
                        // Other fields...
                    }
                ]
            }
        }
    */
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
    /*
        #swagger.tags = ["Comment"]
        #swagger.summary = "Create a New Comment"
        #swagger.description = "Create a new comment and associate it with a trade"
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                tradeId: "trade-id",
                userId: "user-id",
                text: "This is a comment",
                // Other fields...
            }
        }
        #swagger.responses[201] = {
            description: "Comment created successfully",
            schema: {
                error: false,
                message: "Comment successfully created",
                data: {
                    _id: "comment-id",
                    text: "This is a comment",
                    userId: {
                        _id: "user-id",
                        username: "JohnDoe",
                        firstName: "John",
                        lastName: "Doe",
                    },
                    tradeId: "trade-id",
                    // Other fields...
                }
            }
        }
        #swagger.responses[404] = {
            description: "Trade not found",
            schema: {
                error: true,
                message: "Trade not found"
            }
        }
    */
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
    /*
        #swagger.tags = ["Comment"]
        #swagger.summary = "Get Comment Details"
        #swagger.description = "Fetch details of a single comment by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the comment to fetch"
        }
        #swagger.responses[200] = {
            description: "Comment details fetched successfully",
            schema: {
                error: false,
                data: {
                    _id: "comment-id",
                    text: "This is a comment",
                    userId: {
                        _id: "user-id",
                        username: "JohnDoe",
                        firstName: "John",
                        lastName: "Doe",
                    },
                    tradeId: "trade-id",
                    // Other fields...
                }
            }
        }
    */
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
    /*
        #swagger.tags = ["Comment"]
        #swagger.summary = "Update a Comment"
        #swagger.description = "Update an existing comment by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the comment to update"
        }
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                text: "Updated comment text",
                // Other fields...
            }
        }
        #swagger.responses[202] = {
            description: "Comment updated successfully",
            schema: {
                error: false,
                message: "Comment successfully updated",
                data: {
                    _id: "comment-id",
                    text: "Updated comment text",
                    userId: {
                        _id: "user-id",
                        username: "JohnDoe",
                        firstName: "John",
                        lastName: "Doe",
                    },
                    tradeId: "trade-id",
                    // Other fields...
                }
            }
        }
    */
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
    /*
        #swagger.tags = ["Comment"]
        #swagger.summary = "Delete a Comment"
        #swagger.description = "Delete a comment by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the comment to delete"
        }
        #swagger.responses[204] = {
            description: "Comment deleted successfully",
            schema: {
                error: false,
                message: "Comment successfully deleted"
            }
        }
        #swagger.responses[404] = {
            description: "Comment not found",
            schema: {
                error: true,
                message: "Comment not found!"
            }
        }
    */
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
