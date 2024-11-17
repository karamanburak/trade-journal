"use strict";

const router = require("express").Router();

const account = require("../controllers/account");
const idValidation = require("../middlewares/idValidation");
const { isAccountOwner } = require("../middlewares/permissions");

// URL: /accounts

router.route("/").get(account.list).post(account.create);

router
  .route("/:id")
  .all(idValidation, isAccountOwner)
  .get(account.read)
  .put(account.update)
  .delete(account.delete);

module.exports = router;
