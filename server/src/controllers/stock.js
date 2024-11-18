"use strict";
const Stock = require("../models/stock");

module.exports = {
  list: async (req, res) => {
    /*
        #swagger.tags = ["Stock"]
        #swagger.summary = "Get List of Stocks"
        #swagger.description = "Fetch a list of all stocks"
        #swagger.responses[200] = {
            description: "Stocks fetched successfully",
            schema: {
                error: false,
                details: {
                    totalCount: 100,
                    // Other details...
                },
                data: [
                    {
                        _id: "stock-id",
                        name: "Sample Stock",
                        price: 100,
                        // Other fields...
                    }
                ]
            }
        }
    */
    const data = await res.getModelList(Stock);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(Stock),
      data,
    });
  },
  create: async (req, res) => {
    /*
        #swagger.tags = ["Stock"]
        #swagger.summary = "Create a New Stock"
        #swagger.description = "Create a new stock entry"
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                name: "Sample Stock",
                price: 100,
                // Other fields...
            }
        }
        #swagger.responses[201] = {
            description: "Stock created successfully",
            schema: {
                error: false,
                message: "Stock created successfully",
                data: {
                    _id: "stock-id",
                    name: "Sample Stock",
                    price: 100,
                    // Other fields...
                }
            }
        }
    */
    const newStock = await Stock.create(req.body);

    res.status(201).send({
      error: false,
      message: "Stock created successfully",
      data: newStock,
    });
  },
  read: async (req, res) => {
    /*
        #swagger.tags = ["Stock"]
        #swagger.summary = "Get Stock Details"
        #swagger.description = "Fetch details of a single stock by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the stock to fetch"
        }
        #swagger.responses[200] = {
            description: "Stock details fetched successfully",
            schema: {
                error: false,
                data: {
                    _id: "stock-id",
                    name: "Sample Stock",
                    price: 100,
                    // Other fields...
                }
            }
        }
    */
    const data = await Stock.findOne({ _id: req.params.id });

    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
        #swagger.tags = ["Stock"]
        #swagger.summary = "Update a Stock"
        #swagger.description = "Update an existing stock by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the stock to update"
        }
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                name: "Updated Stock Name",
                price: 150,
                // Other fields...
            }
        }
        #swagger.responses[202] = {
            description: "Stock updated successfully",
            schema: {
                error: false,
                message: "Stock updated successfully",
                data: {
                    _id: "stock-id",
                    name: "Updated Stock Name",
                    price: 150,
                    // Other fields...
                }
            }
        }
        #swagger.responses[404] = {
            description: "Stock not found",
            schema: {
                error: true,
                message: "Stock not found"
            }
        }
    */
    const updatedStock = await Stock.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { runValidators: true, new: true }
    );

    res.status(202).send({
      error: false,
      message: "Stock updated successfully",
      data: updatedStock,
    });
  },
  delete: async (req, res) => {
    /*
        #swagger.tags = ["Stock"]
        #swagger.summary = "Delete a Stock"
        #swagger.description = "Delete a stock by its ID"
        #swagger.parameters["id"] = {
            in: "path",
            required: true,
            type: "string",
            description: "ID of the stock to delete"
        }
        #swagger.responses[204] = {
            description: "Stock deleted successfully",
            schema: {
                error: false,
                message: "Stock successfully deleted!"
            }
        }
        #swagger.responses[404] = {
            description: "Stock not found",
            schema: {
                error: true,
                message: "Stock not found!"
            }
        }
    */
    const data = await Stock.deleteOne({ _id: req.params.id });

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
      message: data.deletedCount
        ? "Stock deleted successfully"
        : "Stock not found",
    });
  },
};
