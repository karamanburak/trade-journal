"use strict";

const router = require("express").Router();
const idValidation = require("../middlewares/idValidation");
const user = require("../controllers/user");

//URL: /users

router.route("/").get(user.list);
router
  .route("/:id")
  .all(idValidation)
  .get(user.read)
  .put(user.update)
  .patch(user.update)
  .delete(user.delete);

module.exports = router;
