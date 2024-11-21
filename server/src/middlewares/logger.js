"use strict";

const morgan = require("morgan");
const fs = require("node:fs");

const today = new Date().toLocaleDateString("en-CA");

module.exports = morgan("combined", {
  stream: fs.createWriteStream(`./logs/${today}.log`, { flags: "a+" }),
});
