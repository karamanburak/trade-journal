"use strict";
/* -------------------------------------------------------
    NODEJS EXPRESS | Blogyy API
------------------------------------------------------- */
// app.use(upload.array('fieldName'))

const multer = require("multer");

module.exports = multer({
  // dest: "./uploads", // root
  storage: multer.diskStorage({
    destination: "./uploads",
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  // limits: {
  //   fileSize: 5 * 1024 * 1024, // 5MB
  // },
  // fileFilter: (req, file, cb) => {
  //   if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
  //     return cb(new Error("Only image files are allowed!"), false);
  //   }
  //   cb(null, true);
  // },
});
