"use strict";

const router = require("express").Router();

const capital = require("../controllers/capital");
const idValidation = require("../middlewares/idValidation");

//URL: /capitals

router.route("/").get(capital.list).post(capital.create);
router
  .route("/:id")
  .all(idValidation)
  .get(capital.read)
  .put(capital.update)
  .patch(capital.update)
  .delete(capital.delete);

module.exports = router;
