"use strict";

const nodemailer = require("nodemailer");
const { NODEMAILER_EMAIL, NODEMAILER_PASSWORD } = require("../../../setups");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: NODEMAILER_EMAIL,
    pass: NODEMAILER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Trade Journal" <${NODEMAILER_EMAIL}>`,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully.", info.messageId);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendEmail };
