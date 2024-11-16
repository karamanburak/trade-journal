"use strict";

const router = require("express").Router();

//token:
router.use("/tokens", require("./token"));
// auth:
router.use("/auth", require("./auth"));
// users:
router.use("/users", require("./user"));
// trades:
router.use("/trades", require("./trade"));
// positions:
router.use("/positions", require("./position"));
// documentations:
router.use("/documentations", require("./documentation"));

module.exports = router;
