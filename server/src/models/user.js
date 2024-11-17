"use strict";

const { mongoose } = require("../configs/dbConnection");
const { CustomError } = require("../errors/customError");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: {
        values: ["admin", "individual"],
        message: "Invalid userType. Valid values are: admin, individual.",
      },
      required: [true, "UserType is required."],
      immutable: true, // Once entered, userType cannot be changed again
    },
    username: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      trim: true,
      required: true,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      validate: [validator.isEmail, "Please provide a valid email address."],
    },
    password: {
      type: String,
      required: true,
      select: false,
      set: function (password) {
        if (validator.isStrongPassword(password)) {
          return password;
        } else {
          throw new CustomError("Password type is incorrect!", 400);
        }
      },
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    verificationToken: String,
    verificationTokenExpiresAt: Date,
  },
  {
    collection: "users",
    timestamps: true,
  }
);

module.exports = mongoose.model("User", UserSchema);
