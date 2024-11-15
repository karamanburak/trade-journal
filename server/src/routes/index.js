"use strict";

const router = require("express").Router();

//token:
router.use("/tokens", require("./token"));
// auth:
// router.use("/auth", require("./authRouter"));
// user:
router.use("/users", require("./user"));

module.exports = router;
