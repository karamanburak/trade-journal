"use strict";

const { PAGE_SIZE } = require("../../setups");
const { CustomError } = require("../errors/customError");

module.exports = async (req, res, next) => {
  /* FILTERING & SEARCHING & SORTING & PAGINATION */

  //! Example Usage
  //^ GET /trades?filter[symbol]=AAPL&filter[tradeDate]=2024-11-22&filter[status]=COMPLETED&sort[tradeDate]=desc&page=1&limit=5

  const filter = req.query?.filter || {};
  const filterCriteria = {};

  // Filter by tradeDuration (if provided in the filter object)
  if (filter.tradeDuration) {
    const duration = Number(filter.tradeDuration);
    if (isNaN(duration) || duration < 0) {
      throw new CustomError("Invalid trade duration", 400);
    }
    filterCriteria.tradeDuration = duration;
  }

  // Stock Symbol Filter
  if (filter.symbol) {
    if (typeof filter.symbol !== "string" || filter.symbol.trim() === "") {
      throw new CustomError("Invalid stock symbol", 400);
    }
    filterCriteria.symbol = { $regex: filter.symbol, $options: "i" };
  }

  // Trade Type Filter (BUY or SELL)
  if (filter.type) {
    if (!["BUY", "SELL"].includes(filter.type.toUpperCase())) {
      throw new CustomError("Invalid trade type", 400);
    }
    filterCriteria.type = filter.type.toUpperCase();
  }

  if (filter.stock) {
    if (typeof filter.stock !== "string" || filter.stock.trim() === "") {
      throw new CustomError("Invalid stock ID", 400);
    }
    const stocks = filter.stock.split(",").map((stock) => stock.trim());

    const Stock = require("../models/stock");

    const stockId = await Stock.find({
      name: { $in: stocks.map((c) => new RegExp(c, "i")) }, // case insensitive
    });

    const matchingStockId = stockId.map((stock) => stock._id);

    if (matchingStockId.length) {
      filterCriteria.stockId = { $in: matchingStockId };
    }
  }

  // User ID Filter
  if (filter.userId) {
    const { ObjectId } = require("mongoose").Types;
    if (!ObjectId.isValid(filter.userId)) {
      throw new CustomError("Invalid user ID", 400);
    }
    filterCriteria.userId = filter.userId;
  }

  // Completed Status Filter
  if (filter.status) {
    if (
      !["OPEN", "COMPLETED", "CANCELLED"].includes(filter.status.toUpperCase())
    ) {
      throw new CustomError("Invalid trade status", 400);
    }
    filterCriteria.status = filter.status.toUpperCase();
  }

  // ### SEARCHING ###
  const search = req.query?.search || {};
  const searchCriteria = {};

  // Search by Notes
  if (search.notes) {
    if (typeof search.notes !== "string" || search.notes.trim() === "") {
      throw new CustomError("Invalid notes search", 400);
    }
    searchCriteria.notes = { $regex: search.notes, $options: "i" };
  }

  // Search by User
  if (search.userId) {
    const { ObjectId } = require("mongoose").Types;
    if (!ObjectId.isValid(search.userId)) {
      throw new CustomError("Invalid user ID", 400);
    }
    searchCriteria.userId = search.userId;
  }

  // ### SORTING ###
  const sort = req.query?.sort || {};
  const sortCriteria = {};

  for (let key in sort) {
    if (!["asc", "desc"].includes(sort[key].toLowerCase())) {
      throw new CustomError("Invalid sort order", 400);
    }
    sortCriteria[key] = sort[key].toLowerCase() === "asc" ? 1 : -1;
  }

  // Default sort by trade date descending
  if (!Object.keys(sortCriteria).length) {
    sortCriteria.tradeDate = -1;
  }

  // console.log("Request Query:", req.query);
  // console.log("Filter Criteria:", filterCriteria);
  // console.log("Sort Criteria:", sortCriteria);

  // ### PAGINATION ###
  let limit = Number(req.query?.limit);
  if (isNaN(limit) || limit <= 0) {
    limit = Number(PAGE_SIZE || 10);
  }

  let page = Number(req.query?.page);
  page = page > 0 ? page - 1 : 0;

  let skip = page * limit;

  /* EXTENDED HANDLER */
  // Run for output:
  res.getModelList = async (Model, customFilter = {}, populate = null) => {
    if (Model.modelName === "Stock") {
      return await Model.find({
        ...filterCriteria,
        ...searchCriteria,
        ...customFilter,
      }).populate(populate);
    }

    return await Model.find({
      ...filterCriteria,
      ...searchCriteria,
      ...customFilter,
    })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate);
  };

  // Details:
  res.getModelListDetails = async (Model, customFilter = {}) => {
    const data = await Model.find({
      ...filterCriteria,
      ...searchCriteria,
      ...customFilter,
    });

    let details = {};

    if (Model.modelName === "Stock") {
      details = {
        filter,
        search,
        sort,
        totalRecords: data.length,
      };
    } else {
      details = {
        filter,
        search,
        sort,
        skip,
        limit,
        page,
        pages: {
          previous: page > 0 ? page : false,
          current: page + 1,
          next: page + 2,
          total: Math.ceil(data.length / limit),
        },
        totalRecords: data.length,
      };

      details.pages.next =
        details.pages.next > details.pages.total ? false : details.pages.next;
      if (details.totalRecords <= limit) details.pages = false;
    }

    return details;
  };

  next();
};
