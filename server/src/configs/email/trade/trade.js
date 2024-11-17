const fs = require("fs");
const path = require("path");
const { CLIENT_URL } = require("../../../../setups");

const getTradeCreatedEmailHtml = (firstName, trade) => {
  let html = fs.readFileSync(path.join(__dirname, "trade.html"), "utf8");
  html = html.replace("{{firstName}}", firstName);
  html = html.replace("{{stockSymbol}}", trade.stockSymbol);
  html = html.replace("{{tradeDate}}", trade.tradeDate || "Unknown Date");
  html = html.replace("{{tradeType}}", trade.type || "Unknown Type");
  html = html.replace("{{tradePrice}}", trade.price || "Unknown Price");
  html = html.replace(
    "{{tradeQuantity}}",
    trade.quantity || "Unknown Quantity"
  );
  html = html.replace(
    "{{tradeTotalPrice}}",
    trade.price * trade.quantity || "Unknown Total Price"
  );
  html = html.replace("{{tradeStatus}}", trade.status || "Unknown Status");
  html = html.replace(/{{clientUrl}}/g, CLIENT_URL);

  return html;
};

module.exports = { getTradeCreatedEmailHtml };
