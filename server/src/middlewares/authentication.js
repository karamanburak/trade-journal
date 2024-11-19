"use strict";

const { ACCESS_KEY } = require("../../setups");
const Token = require("../models/token");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const auth = req.headers?.authorization || null;
  const tokenKey = auth ? auth.split(" ") : null;

  if (tokenKey) {
    if (tokenKey[0] == "Token") {
      // SimpleToken:

      const tokenData = await Token.findOne({ token: tokenKey[1] }).populate(
        "userId"
      );
      req.user = tokenData ? tokenData.userId : undefined;
    } else if (tokenKey[0] == "Bearer") {
      // JWT:

      jwt.verify(tokenKey[1], ACCESS_KEY, (error, data) => {
        if (data) {
          req.user = data;
        } else {
          // console.log("JWT failed to verify:", error);
          req.user = null;
        }
      });
    }
  }

  next();
};
