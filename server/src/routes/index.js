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
// accounts:
router.use("/accounts", require("./account"));
// deposits:
router.use("/deposits", require("./deposit"));
// capitals:
router.use("/capitals", require("./capital"));
// stocks:
router.use("/stocks", require("./stock"));
// notes:
router.use("/notes", require("./note"));
// comments:
router.use("/comments", require("./comment"));
// documentations:
router.use("/documentations", require("./documentation"));

module.exports = router;
