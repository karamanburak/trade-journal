"use strict";

const Capital = require("../models/capital");
const { CustomError } = require("../errors/customError");

module.exports = {
  list: async (req, res) => {
    /*
        #swagger.tags = ["Capital"]
        #swagger.summary = "Get List of Capitals"
        #swagger.description = "Fetch a list of all capitals for the authenticated user"
        #swagger.responses[200] = {
            description: "Capitals fetched successfully",
            schema: {
                error: false,
                data: [
                    {
                        _id: "capital-id",
                        userId: "user-id",
                        amount: 5000,
                        date: "2024-11-17T00:00:00.000Z",
                    },
                ],
            },
        }
    */
    const data = await Capital.find({ userId: req.user._id });

    res.status(200).send({
      error: false,
      data,
    });
  },

  create: async (req, res) => {
    /*
        #swagger.tags = ["Capital"]
        #swagger.summary = "Create or Update Capital"
        #swagger.description = "Create or update capital for the authenticated user"
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                amount: 5000,
            },
        }
        #swagger.responses[201] = {
            description: "Capital created or updated successfully",
            schema: {
                error: false,
                message: "Capital updated successfully",
                data: {
                    _id: "capital-id",
                    userId: "user-id",
                    amount: 5000,
                    date: "2024-11-17T00:00:00.000Z",
                },
            },
        }
    */

    const { amount } = req.body;

    if (!amount || isNaN(Number(amount)) || Number(amount) < 0) {
      throw new CustomError(
        "Invalid amount. It must be a positive number.",
        400
      );
    }

    const newCapital = await Capital.create(req.body);

    res.status(201).send({
      error: false,
      message: "Capital updated successfully",
      data: newCapital,
    });
  },

  read: async (req, res) => {
    /*
        #swagger.tags = ["Capital"]
        #swagger.summary = "Get Capital Details"
        #swagger.description = "Fetch details of the capital for the authenticated user"
        #swagger.responses[200] = {
            description: "Capital details fetched successfully",
            schema: {
                error: false,
                data: {
                    _id: "capital-id",
                    userId: "user-id",
                    amount: 5000,
                    date: "2024-11-17T00:00:00.000Z",
                },
            },
        }
    */

    const capital = await Capital.findOne({ userId: req.user._id });

    if (!capital) {
      throw new CustomError("Capital record not found", 404);
    }

    res.status(200).send({
      error: false,
      data: capital,
    });
  },

  update: async (req, res) => {
    /*
        #swagger.tags = ["Capital"]
        #swagger.summary = "Update a Capital"
        #swagger.description = "Update an existing capital by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the capital to update",
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
            description: "Capital updated successfully",
            schema: {
                error: false,
                message: "Capital updated successfully",
                data: {
                                      _id: "capital-id",
                    userId: "user-id",
                    amount: 5000,
                    date: "2024-11-17T00:00:00.000Z",
                },
            },
        }
        #swagger.responses[404] = {
            description: "Capital not found",
            schema: {
                error: true,
                message: "Capital not found",
            },
        }
    */

    const updatedCapital = await Capital.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedCapital) {
      throw new CustomError("Capital not found", 404);
    }
    res.status(202).send({
      error: false,
      message: "Capital updated successfully",
      data: updatedCapital,
    });
  },

  delete: async (req, res) => {
    /*
        #swagger.tags = ["Capital"]
        #swagger.summary = "Delete Capital"
        #swagger.description = "Delete the capital record for the authenticated user"
        #swagger.responses[204] = {
            description: "Capital deleted successfully",
        }
        #swagger.responses[404] = {
            description: "Capital not found",
            schema: {
                error: true,
                message: "Capital not found",
            },
        }
    */

    const data = await Capital.deleteOne({ userId: req.user._id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      message: data.deletedCount
        ? "Capital deleted successfully"
        : "Capital not found",
    });
  },
};
