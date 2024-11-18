"use strict";

const { PAGE_SIZE } = require("../../setups");
const { CustomError } = require("../errors/customError");

module.exports = async (req, res, next) => {
  /* FILTERING & SEARCHING & SORTING & PAGINATION */

  //! Example Usage
  //^ GET /trades?filter[symbol]=AAPL&filter[tradeDate]=2024-11-22&filter[status]=COMPLETED&sort[tradeDate]=desc&page=1&limit=5

  const filter = req.query?.filter || {};
  const filterCriteria = {};

  // Trade Date Filter
  if (filter.startDate) {
    const startDate = new Date(filter.startDate);
    if (isNaN(startDate.getTime())) {
      throw new CustomError("Invalid start date", 400);
    }
    filterCriteria.tradeDate = { $gte: startDate };
  }

  if (filter.endDate) {
    const endDate = new Date(filter.endDate);
    if (isNaN(endDate.getTime())) {
      throw new CustomError("Invalid end date", 400);
    }
    filterCriteria.tradeDate = filterCriteria.tradeDate || {};
    filterCriteria.tradeDate.$lte = endDate;
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

  // ### PAGINATION ###
  let limit = Number(req.query?.limit);
  if (isNaN(limit) || limit <= 0) {
    limit = Number(PAGE_SIZE || 10);
  }

  let page = Number(req.query?.page);
  page = page > 0 ? page - 1 : 0;

  let skip = page * limit;

  /* EXTENDED HANDLER */
  res.getModelList = async (Model, customFilter = {}, populate = null) => {
    return await Model.find({
      ...filterCriteria,
      ...searchCriteria,
      ...customFilter,
    })
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
      .populate(populate);
  };

  res.getModelListDetails = async (Model, customFilter = {}) => {
    const data = await Model.find({
      ...filterCriteria,
      ...searchCriteria,
      ...customFilter,
    });

    const totalRecords = data.length;

    return {
      filter,
      search,
      sort,
      page: page + 1,
      limit,
      totalRecords,
      totalPages: Math.ceil(totalRecords / limit),
    };
  };

  next();
};
