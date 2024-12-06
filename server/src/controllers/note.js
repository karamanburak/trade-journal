"use strict";

const Note = require("../models/note");
const Trade = require("../models/trade");
const { CustomError } = require("../errors/customError");

module.exports = {
  list: async (req, res) => {
    /*
        #swagger.tags = ["Note"]
        #swagger.summary = "Get List of Notes"
        #swagger.description = "Fetch a list of all Notes, including related open trades"
        #swagger.responses[200] = {
            description: "Notes fetched successfully",
            schema: {
                error: false,
                details: {
                    totalCount: 100,
                    // More details...
                },
                data: [
                    {
                        _id: "Note-id",
                        Note: "Content",
                    },
                ],
            },
        }
    */
    const data = await res.getModelList(Note, {}, []);

    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Note, {}),
      data,
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags = ["Note"]
        #swagger.summary = "Create a New Note"
        #swagger.description = "Create a new Note for a specific stock"
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                Note:"Content",
            },
        }
        #swagger.responses[201] = {
            description: "Note created successfully",
            schema: {
                status: "success",
                data: {
                    _id: "Note-id",
                    userId: "user-id",
                    Note: "Content",
                },
            },
        }
        #swagger.responses[400] = {
            description: "Note already exists",
            schema: {
                error: true,
                message: "Note already exists",
            },
        }
    */

    const data = await Note.create(req.body);

    const trade = await Trade.findById(req.body.tradeId);
    trade.notes.push(data._id);
    await trade.save();

    res.status(201).json({
      error: false,
      message: "Note successfully created",
      data,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Note"]
        #swagger.summary = "Get Note Details"
        #swagger.description = "Fetch details of a single Note by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the Note to fetch",
        }
        #swagger.responses[200] = {
            description: "Note details fetched successfully",
            schema: {
                error: false,
                data: {
                    _id: "Note-id",
                    stockSymbol: "AAPL",
                    quantity: 100,
                    averagePrice: 150,
                    totalInvestment: 15000,
                },
            },
        }
        #swagger.responses[404] = {
            description: "Note not found",
            schema: {
                error: true,
                message: "Note not found",
            },
        }
    */
    const data = await Note.findOne({
      _id: req.params.id,
    });
    if (!data) {
      throw new CustomError("Note not found", 404);
    }
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
        #swagger.tags = ["Note"]
        #swagger.summary = "Update a Note"
        #swagger.description = "Update an existing Note by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the Note to update",
        }
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                quantity: 150,
                price: 155,
            },
        }
        #swagger.responses[202] = {
            description: "Note updated successfully",
            schema: {
                error: false,
                message: "Note updated successfully",
                data: {
                    _id: "Note-id",
                    stockSymbol: "AAPL",
                    quantity: 150,
                    averagePrice: 155,
                    totalInvestment: 23250,
                    currentValue: 23250,
                },
            },
        }
        #swagger.responses[404] = {
            description: "Note not found",
            schema: {
                error: true,
                message: "Note not found",
            },
        }
    */

    const data = await Note.updateOne({ _id: req.params.id }, req.body, {
      runValidators: true,
      new: true,
    });
    res.status(202).send({
      error: false,
      message: "Note successfully updated",
      data,
      new: await Note.findOne({ _id: req.params.id }),
    });
  },
  delete: async (req, res) => {
    /*
        #swagger.tags = ["Note"]
        #swagger.summary = "Delete a Note"
        #swagger.description = "Delete a Note by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the Note to delete",
        }
        #swagger.responses[204] = {
            description: "Note deleted successfully",
            schema: {
                error: false,
                message: "Note successfully deleted!",
            },
        }
        #swagger.responses[404] = {
            description: "Note not found",
            schema: {
                error: true,
                message: "Note not found!",
            },
        }
    */
    const data = await Note.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
      message: data.deletedCount
        ? "Note successfully deleted!"
        : "Note not found!",
    });
  },
};
