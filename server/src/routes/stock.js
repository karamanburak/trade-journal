"use strict";

const router = require("express").Router();
const stock = require("../controllers/stock");
const idValidation = require("../middlewares/idValidation");

// URL: /stocks

router.route("/").get(stock.list).post(stock.create);
router
  .route("/:id")
  .all(idValidation)
  .get(stock.read)
  .put(stock.update)
  .patch(stock.update)
  .delete(stock.delete);

module.exports = router;
