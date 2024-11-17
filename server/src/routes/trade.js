"use strict";

const router = require("express").Router();

const trade = require("../controllers/trade");
const idValidation = require("../middlewares/idValidation");
const { isTradeOwner } = require("../middlewares/permissions");

//URL: /trades

router.route("/").get(trade.list).post(trade.create);
router
  .route("/:id")
  .all(idValidation, isTradeOwner)
  .get(trade.read)
  .put(trade.update)
  .patch(trade.update)
  .delete(trade.delete);

module.exports = router;
