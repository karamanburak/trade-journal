"use strict";

const router = require("express").Router();

//token
router.use("/tokens", require("./token"));

module.exports = router;
