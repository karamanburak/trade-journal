"use strict";

const bcrypt = require("bcryptjs");
const { CustomError } = require("../errors/customError");
const User = require("../models/user");
const Token = require("../models/token");
const { getWelcomeEmailHtml } = require("../configs/email/welcome/welcome");
const { sendEmail } = require("../configs/email/emailService");

module.exports = {
  register: async (req, res) => {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Register"
        #swagger.description = 'Register with valid fullName, email, and password'
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
              "firstName": "John",
              "lastName": "Doe",
              "email": "john.doe@gmail.com",
              "password": "Test@1234",
            }
        }
        #swagger.responses[201] = {
            description: 'User registered successfully',
            schema: {
                error: false,
                message: "Your registration is successful"
            }
        }
        #swagger.responses[400] = {
            description: 'Bad request, validation error',
            schema: {
                error: true,
                message: 'Validation error message'
            }
        }
    */

    const { email, username, firstName, lastName, password } = req.body;

    if (!email || !username || !firstName || !lastName || !password) {
      return res.status(400).send({
        error: true,
        message: "All fields are required.",
      });
    }

    // Check if the email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).send({
        error: true,
        message: "Email already exists. Please use a different email address.",
      });
    }

    // Check if the username already exists
    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).send({
        error: true,
        message: "Username already exists. Please use a different username.",
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
    } catch (err) {
      return res.status(500).send({
        error: true,
        message: "An error occurred while hashing the password.",
      });
    }

    const newUser = await User.create({
      username,
      firstName,
      lastName,
      email,
      password: hashedPassword,
      isActive: true,
    });

    // Send email to user
    const emailSubject = "Welcome to Trade Journal!";
    const emailHtml = getWelcomeEmailHtml(firstName);
    await sendEmail(email, emailSubject, emailHtml);

    res.status(201).send({
      error: false,
      message: "User created successfully!",
      newUser,
    });
  },
  login: async (req, res) => {
    /*
      #swagger.tags = ["Authentication"]
      #swagger.summary = "Login"
      #swagger.description = 'Login with email and password to get simpleToken and JWT'
      #swagger.parameters["body"] = {
          in: "body",
          required: true,
          schema: {
              "email": "testUser@gmail.com",
              "password": "Test@1234",
          }
      }
      #swagger.responses[200] = {
        description: 'Login successful',
        schema: {
          error: false,
          message: 'You are successfully logged in!',
          token: 'simple-token',
          user: {
            _id: 'user-id',
            fisrtName: 'John',
            lasttName: 'Doe',
            ...
          }
        }
      }
      #swagger.responses[400] = {
        description: 'Validation error or missing fields',
        schema: {
          error: true,
          message: 'Validation error message or missing fields message'
        }
      }
      #swagger.responses[401] = {
        description: 'Wrong email or password',
        schema: {
          error: true,
          message: 'Wrong email or password. Please try again!'
        }
      }
    */

    const { email, password } = req.body;
    // console.log("Login attempt:", email, password);

    if (email && password) {
      const user = await User.findOne({ email });
      if (!user) {
        throw new CustomError("Wrong email or password!", 401);
      }
      if (!user.isActive) {
        throw new CustomError(
          "Your account is not active. Please verify your email address.",
          401
        );
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        let tokenData = await Token.findOne({ userId: user._id });
        if (!tokenData) {
          const plainTextToken = `${user._id}-${Date.now()}`;
          const hashedToken = await bcrypt.hash(plainTextToken, 10);

          // Save the hashed token to the database
          tokenData = await Token.create({
            userId: user._id,
            token: hashedToken,
          });
          res.status(200).send({
            error: false,
            message: "You are successfully logged in!",
            token: tokenData.token,
            user,
          });
        }
      }
    }
  },
  logout: async (req, res) => {
    /*
    #swagger.tags = ["Authentication"]
    #swagger.summary = "SimpleToken: Logout"
    #swagger.description = 'Delete simple token key and bypass JWT token'
    #swagger.responses[200] = {
      description: 'Logout successful',
      schema: {
        error: false,
        message: 'You are successfully logged out!'
      }
    }
    #swagger.responses[401] = {
      description: 'Unauthorized',
      schema: {
        error: true,
        message: 'No Authorization Header provided!'
      }
    }
    #swagger.responses[400] = {
      description: 'Logout failed',
      schema: {
        error: true,
        message: 'Logout failed. Please try again!'
      }
    }
  */
    const auth = req.headers?.authorization;
    const tokenKey = auth ? auth.split(" ") : null;
    let deleted = null;

    if (tokenKey && tokenKey[0] == "Token") {
      deleted = await Token.deleteOne({ token: tokenKey[1] });
      res.status(deleted?.deletedCount > 0 ? 200 : 400).send({
        error: !deleted?.deletedCount,
        deleted,
        message:
          deleted?.deletedCount > 0
            ? "You are successfully logged out!"
            : "Logout failed. Please try again!  ",
      });
    } else {
      res.send({
        error: false,
        message: "No Authorization Header provided!",
      });
    }
  },
};
