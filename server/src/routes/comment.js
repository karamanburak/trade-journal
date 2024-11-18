"use strict";

const router = require("express").Router();

const comment = require("../controllers/comment");
const idValidation = require("../middlewares/idValidation");

// URL: /comments

router.route("/").get(comment.list).post(comment.create);
router
  .route("/:id")
  .all(idValidation)
  .get(comment.read)
  .put(comment.update)
  .patch(comment.update)
  .delete(comment.delete);

/* ------------------------------------------------------- */
module.exports = router;
