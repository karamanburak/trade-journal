"use strict";

require("express-async-errors");
const express = require("express");
const app = express();
const cors = require("cors");
const { PORT, HOST, VERSION } = require("./setups");

// Connect to DB:
const { dbConnection } = require("./src/configs/dbConnection");
dbConnection();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);
// envVariables to process.env:
require("dotenv").config();

// Accept JSON
app.use(express.json());

// - Logger
app.use(require("./src/middlewares/logger"));

// - Authentication
app.use(require("./src/middlewares/authentication"));

// - QueryHandler
app.use(require("./src/middlewares/queryHandler"));

// Routes;
app.use(`/api/${VERSION}`, require("./src/routes"));

app.get("/", (req, res) => {
  res.redirect(`/api/${VERSION}`);
});

app.all(`/api/${VERSION}`, (req, res) => {
  res.send({
    error: false,
    message: "Welcome to Trade Journal API",
    docs: {
      swagger: `/api/${VERSION}/documentations/swagger`,
      redoc: `/api/${VERSION}/documentations/redoc`,
      json: `/api/${VERSION}/documentations/json`,
    },
    user: req.user,
  });
});

app.use((req, res, next) => {
  res.status(404).send({
    error: true,
    message: "Route not found",
  });
});

// Error Handler Middleware
app.use(require("./src/middlewares/errorHandler"));

app.listen(PORT, () => console.log(`server running on http://${HOST}:${PORT}`));

// Syncronization
// require("./src/helpers/sync")();
