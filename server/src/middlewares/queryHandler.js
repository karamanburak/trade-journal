"use strict";
const { PAGE_SIZE } = require("../../setups");
const { CustomError } = require("../errors/customError");

module.exports = async (req, res, next) => {
  /* FILTERING & SEARCHING & SORTING & PAGINATION */
  //! Example Usage
  //^ GET /trades?filter[stockSymbol]=AAPL&filter[tradeDate]=2024-11-22&filter[status]=COMPLETED&sort[tradeDate]=desc&page=1&limit=5
  // ? This request is asking for completed trades of the Apple (AAPL) stock symbol that took place on November 22, 2024, sorted by the most recent trade date. The response will contain up to 5 trades per page and will be returned from page 1.
  // ### FILTERING ###
  // URL?filter[tradeDate]=value1&filter[stockSymbol]=value2
  const filter = req.query?.filter || {};

  const filterCriteria = {};

  if (filter.tradeDate) {
    const tradeDate = new Date(filter.tradeDate);
    if (isNaN(tradeDate.getTime())) {
      throw new CustomError("Invalid trade date format", 400);
    }
    filterCriteria.tradeDate = { $gte: tradeDate };
  }

  // Filter for `stockSymbol` (search term)
  if (filter.stockSymbol) {
    if (
      typeof filter.stockSymbol !== "string" ||
      filter.stockSymbol.trim() === ""
    ) {
      throw new CustomError("Invalid stock symbol", 400);
    }
    filterCriteria.stockSymbol = filter.stockSymbol.trim();
  }

  // Filter for `status`
  if (filter.status) {
    if (typeof filter.status !== "string" || filter.status.trim() === "") {
      throw new CustomError("Invalid status", 400);
    }
    filterCriteria.status = filter.status.trim();
  }

  for (let key in filter) {
    // Skip already handled filters like `tradeDate`, `stockSymbol`, and `status`
    if (!["tradeDate", "stockSymbol", "status"].includes(key)) {
      if (typeof filter[key] !== "string" || filter[key].trim() === "") {
        throw new CustomError(`Invalid filter for ${key}`, 400);
      }
      filterCriteria[key] = filter[key];
    }
  }

  // console.log(filter);
  // console.log(filterCriteria);

  // ### SEARCHING ###

  // URL?search[key1]=value1&search[key2]=value2
  // https://www.mongodb.com/docs/manual/reference/operator/query/regex/

  const search = req.query?.search || {};
  const searchCriteria = {};

  // console.log(search);

  if (search.stockSymbol) {
    if (
      typeof search.stockSymbol !== "string" ||
      search.stockSymbol.trim() === ""
    ) {
      throw new CustomError("Invalid stock symbol in search", 400);
    }
    searchCriteria.stockSymbol = {
      $regex: new RegExp(search.stockSymbol, "i"),
    };
  }
  // console.log(searchCriteria);

  // ### SORTING ###

  // URL?sort[key1]=asc&sort[key2]=desc
  // asc: A-Z - desc: Z-A
  // https://www.mongodb.com/docs/manual/reference/operator/update/sort/

  const sort = req.query?.sort || {};

  for (let key in sort) {
    if (!["asc", "desc"].includes(sort[key].toLowerCase())) {
      throw new CustomError(`Invalid sort direction for ${key}`, 400);
    }
  }

  // ### PAGINATION ###

  // URL?page=3&limit=5
  let limit = Number(req.query?.limit);
  // console.log(limit)
  if (isNaN(limit) || limit <= 0) {
    limit = Number(PAGE_SIZE || 5);
  }
  // console.log(typeof limit, limit)

  let page = Number(req.query?.page);
  page = page > 0 ? page - 1 : 0;
  // console.log(typeof page, page)

  let skip = Number(req.query?.skip);
  skip = skip > 0 ? skip : page * limit;
  // console.log(typeof skip, skip)

  /* FILTERING & SEARCHING & SORTING & PAGINATION */

  // Run for output:
  res.getModelList = async (Model, customFilter = {}, populate = null) => {
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

    let details = {
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
    return details;
  };

  next();
};
