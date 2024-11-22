const fs = require("fs");
const path = require("path");
const { CLIENT_URL } = require("../../../../setups");

const getTradeCreatedEmailHtml = (firstName, trade, account) => {
  if (!trade) {
    throw new Error("Trade object is missing");
  }
  if (!account) {
    throw new Error("Account object is missing");
  }
  let html = fs.readFileSync(path.join(__dirname, "trade.html"), "utf8");
  html = html.replace("{{firstName}}", firstName || "Unknown First Name");
  html = html.replace("{{stockSymbol}}", trade.symbol || "Unknown Symbol");
  html = html.replace("{{tradeDate}}", trade.transactionDate || "Unknown Date");
  html = html.replace("{{tradeType}}", trade.transactionType || "Unknown Type");
  html = html.replace("{{tradePrice}}", trade.price || "0");
  html = html.replace(
    "{{tradeQuantity}}",
    trade.quantity || "Unknown Quantity"
  );
  html = html.replace(
    "{{tradeTotalPrice}}",
    trade.price * trade.quantity || "0"
  );
  html = html.replace("{{tradeStatus}}", trade.status || "Unknown Status");
  html = html.replace(
    "{{totalValue}}",
    account.totalValue || "Unknown Total Value"
  );
  html = html.replace(/{{clientUrl}}/g, CLIENT_URL);

  return html;
};

module.exports = { getTradeCreatedEmailHtml };
