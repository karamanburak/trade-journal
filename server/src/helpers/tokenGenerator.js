"use strict";

const jwt = require("jsonwebtoken");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const Token = require("../models/token");
const {
  ACCESS_EXP,
  ACCESS_KEY,
  REFRESH_EXP,
  REFRESH_KEY,
} = require("../../setups");

// Generate Simple Token
const generateSimpleToken = async (user) => {
  const token = passwordEncrypt(user._id + Date.now());
  const tokenData = await Token.create({
    userId: user._id,
    token: token,
  });

  const simpleToken = tokenData.token;
  console.log("Simple Token generated: ", simpleToken);
  return simpleToken;
};

// Generate Access Token
const generateAccessToken = (user) => {
  const accessInfo = {
    key: ACCESS_KEY,
    time: ACCESS_EXP || "1d",
    data: {
      _id: user._id,
      email: user.email,
      isActive: user.isActive,
    },
  };

  const accessToken = jwt.sign(accessInfo.data, accessInfo.key, {
    expiresIn: accessInfo.time,
  });

  // console.log("AccessToken generated: ", accessToken);
  return accessToken;
};

// Generate Refresh Token
const generateRefreshToken = (user) => {
  const refreshInfo = {
    key: REFRESH_KEY,
    time: REFRESH_EXP || "2d",
    data: {
      _id: user._id,
    },
  };

  const refreshToken = jwt.sign(refreshInfo.data, refreshInfo.key, {
    expiresIn: refreshInfo.time,
  });

  // console.log("RefreshToken generated: ", refreshToken);
  return refreshToken;
};

// Generate Auth Tokens
const generateAuthTokens = async (user) => {
  const simpleToken = await generateSimpleToken(user);
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return { simpleToken, accessToken, refreshToken };
};

module.exports = {
  generateSimpleToken,
  generateAccessToken,
  generateRefreshToken,
  generateAuthTokens,
};
