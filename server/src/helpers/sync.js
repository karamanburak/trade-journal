"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Trade Journal API
------------------------------------------------------- */
// sync():

module.exports = async function () {
  // return null;

  /* REMOVE DATABASE */
  const { mongoose } = require("../configs/dbConnection");
  await mongoose.connection.dropDatabase();
  console.log("- Database and all data DELETED!");
  /* REMOVE DATABASE */

  // Import Models
  const User = require("../models/user");
  const Stock = require("../models/stock");
  const Trade = require("../models/trade");
  const Position = require("../models/position");
  const Account = require("../models/account");

  /* User */
  await User.deleteMany(); // !!! Clear collection.
  await User.create({
    _id: "65343222b67e9681f937f001",
    username: "admin",
    password: "Password1!",
    email: "admin@tradejournal.com",
    firstName: "Admin",
    lastName: "User",
    isActive: true,
  });
  await User.create({
    _id: "65343222b67e9681f937f002",
    username: "trader1",
    password: "Password1!",
    email: "trader1@tradejournal.com",
    firstName: "John",
    lastName: "Doe",
    isActive: true,
  });
  await User.create({
    _id: "65343222b67e9681f937f003",
    username: "trader2",
    password: "Password1!",
    email: "trader2@tradejournal.com",
    firstName: "Jane",
    lastName: "Smith",
    isActive: true,
  });
  console.log("Users created");

  // Create initial stock data
  const stock1 = await Stock.create({
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "equity",
    exchange: "NASDAQ",
    currency: "USD",
    lastPrice: 150.0,
    marketCap: 2500000000000,
  });
  const stock2 = await Stock.create({
    symbol: "GOOG",
    name: "Google Inc.",
    type: "equity",
    exchange: "NASDAQ",
    currency: "USD",
    lastPrice: 100.0,
    marketCap: 3500000000000,
  });
  const stock3 = await Stock.create({
    symbol: "TSLA",
    name: "Tesla Inc.",
    type: "equity",
    exchange: "NASDAQ",
    currency: "USD",
    lastPrice: 300.0,
    marketCap: 2000000000000,
  });
  console.log("Stocks created");

  // Create initial orders (buy/sell)
  await Trade.create({
    userId: "65343222b67e9681f937f002",
    stockId: stock1._id,
    symbol: "AAPL",
    transactionType: "BUY",
    quantity: 10,
    price: 150.0,
    date: new Date("2024-11-18T10:00:00Z"),
  });
  await Trade.create({
    userId: "65343222b67e9681f937f002",
    stockId: stock2._id,
    symbol: "MSFT",
    transactionType: "SELL",
    quantity: 5,
    price: 300.0,
    date: new Date("2024-11-18T11:00:00Z"),
  });
  console.log("Orders created");

  // Create initial positions (open positions)
  await Position.create({
    userId: "65343222b67e9681f937f002",
    stockId: stock1._id,
    symbol: "AAPL",
    quantity: 10,
    totalInvested: 1500.0,
    averagePrice: 150.0,
  });
  await Position.create({
    userId: "65343222b67e9681f937f002",
    stockId: stock2._id,
    symbol: "MSFT",
    quantity: 5,
    totalInvested: 1500.0,
    averagePrice: 300.0,
  });
  console.log("Positions created");

  // Create initial portfolio
  await Account.create({
    userId: "65343222b67e9681f937f002",
    totalValue: 50000.0,
    totalInvested: 45000.0,
    totalProfitLoss: 5000.0,
    hitRate: 0.75,
    profitFactor: 1.5,
    averageHoldingTime: 45,
  });
  console.log("Portfolio created");

  /* Finished */
  console.log("Initial data created");
};
