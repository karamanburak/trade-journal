"use strict";

const router = require("express").Router();
const idValidation = require("../middlewares/idValidation");
const userController = require("../controllers/user");

//URL: /users

router.route("/").get(userController.list);
router
  .route("/:id")
  .all(idValidation)
  .get(userController.read)
  .put(userController.update)
  .patch(userController.update)
  .delete(userController.delete);

module.exports = router;
