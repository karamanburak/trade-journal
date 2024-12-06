"use strict";

const router = require("express").Router();

const note = require("../controllers/note");
const idValidation = require("../middlewares/idValidation");

// URL: /notes

router.route("/").get(note.list).post(note.create);
router
  .route("/:id")
  .all(idValidation)
  .get(note.read)
  .put(note.update)
  .patch(note.update)
  .delete(note.delete);

/* ------------------------------------------------------- */
module.exports = router;
