"use strict";

const router = require("express").Router();

const position = require("../controllers/position");
const idValidation = require("../middlewares/idValidation");

//URL: /positions

router.route("/").get(position.list).post(position.create);
router
  .route("/:id")
  .all(idValidation)
  .get(position.read)
  .put(position.update)
  .patch(position.update)
  .delete(position.delete);

module.exports = router;
