"use strict";

require("dotenv").config();

module.exports = {
  PORT: process.env?.PORT || 8000,
  HOST: process.env?.HOST || "127.0.0.1",
  BACKEND_URL: process.env?.BACKEND_URL,
  CLIENT_URL: process.env?.CLIENT_URL,
  MONGODB_URI: process.env?.MONGODB_URI,
  PAGE_SIZE: process.env?.PAGE_SIZE || 5,
  VERIFY_EMAIL_KEY: process.env?.VERIFY_EMAIL_KEY,
  VERIFY_EMAIL_EXP: process.env?.VERIFY_EMAIL_EXP || "7d",
  RESET_PASSWORD_KEY: process.env?.RESET_PASSWORD_KEY,
  RESET_PASSWORD_EXP: process.env?.RESET_PASSWORD_EXP || "2m",
  NODE_ENV: process.env.NODE_ENV == "production" ? true : false,
  VERSION: process.env.VERSION,
  NODEMAILER_EMAIL: process.env.NODEMAILER_EMAIL,
  NODEMAILER_PASSWORD: process.env.NODEMAILER_PASSWORD,
  GOOGLE_RECAPTCHA_SECRET_KEY: process.env.GOOGLE_RECAPTCHA_SECRET_KEY,
};
