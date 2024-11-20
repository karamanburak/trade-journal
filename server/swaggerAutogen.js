"use strict";

const { HOST, PORT } = require("./setups");

/* ------------------------------------------------------- */
const swaggerAutogen = require("swagger-autogen")();
const packageJson = require("./package.json");

const document = {
  info: {
    version: packageJson.version,
    title: packageJson.title,
    description: packageJson.description,
    termsOfService: "",
    contact: { name: packageJson.author, email: "tradejournalpjm@gmail.com" },
    license: { name: packageJson.license },
  },
  host: `${HOST}:${PORT}`,
  basePath: "/",
  schemes: ["http", "https"],
  consumes: ["application/json"],
  produces: ["application/json"],
  securityDefinitions: {
    Token: {
      type: "apiKey",
      in: "header",
      name: "Authorization",
      description:
        "Simple Token Authentication * Example: <b>Token ...tokenKey...</b>",
    },
  },
  security: [{ Token: [] }],
  definitions: {
    // Models:
    User: require("./src/models/user").schema.obj,
    Trade: require("./src/models/trade").schema.obj,
    Position: require("./src/models/position").schema.obj,
    Account: require("./src/models/account").schema.obj,
    Deposit: require("./src/models/deposit").schema.obj,
    Capital: require("./src/models/capital").schema.obj,
    Stock: require("./src/models/stock").schema.obj,
    Comment: require("./src/models/comment").schema.obj,
    Token: require("./src/models/token").schema.obj,
  },
};

const routes = ["./index.js"];
const outputFile = "./src/configs/swagger.json";

// Create JSON file:
swaggerAutogen(outputFile, routes, document);
