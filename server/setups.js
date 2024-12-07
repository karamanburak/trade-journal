"use strict";

require("dotenv").config();

module.exports = {
  PORT: process.env?.PORT || 8000,
  HOST: process.env?.HOST || "127.0.0.1",
  BACKEND_URL: process.env?.BACKEND_URL,
  CLIENT_URL: process.env?.CLIENT_URL,
  MONGODB_URI: process.env?.MONGODB_URI,
  PAGE_SIZE: process.env?.PAGE_SIZE || 50,
  VERSION: process.env.VERSION,
  SECRET_KEY: process.env?.SECRET_KEY,
  ACCESS_KEY: process.env?.ACCESS_KEY,
  ACCESS_EXP: process.env?.ACCESS_EXP || "1d",
  REFRESH_KEY: process.env?.REFRESH_KEY,
  REFRESH_EXP: process.env?.REFRESH_EXP || "2d",
  NODEMAILER_EMAIL: process.env?.NODEMAILER_EMAIL,
  NODEMAILER_PASSWORD: process.env?.NODEMAILER_PASSWORD,
};
