"use strict";

const router = require("express").Router();

const deposit = require("../controllers/deposit");
const idValidation = require("../middlewares/idValidation");

//URL: /deposits

router.route("/").get(deposit.list).post(deposit.create);
router.route("/:id").all(idValidation).get(deposit.read).delete(deposit.delete);

module.exports = router;
