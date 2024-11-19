"use strict";

const { CustomError } = require("../errors/customError");
const User = require("../models/user");
// const Account = require("../models/account");
const Deposit = require("../models/deposit");
const Position = require("../models/position");
const Trade = require("../models/trade");
const Account = require("../models/account");

module.exports = {
  /* ---------------------------------- */
  /*             Auth / User            */
  /* ---------------------------------- */
  isLogin: (req, res, next) => {
    if (req.user) {
      return next();
    } else {
      throw new CustomError("NoPermission: You must be logged in.", 403);
    }
  },
  isActive: (req, res, next) => {
    if (req.user.isActive) {
      return next();
    } else {
      throw new CustomError("NoPermission: Your account is not active.", 403);
    }
  },
  checkEmailVerification: (req, res, next) => {
    if (req.user.isEmailVerified) {
      return next();
    } else {
      throw new CustomError("NoPermission: Your email is not verified.", 403);
    }
  },
  isAdmin: (req, res, next) => {
    if (req.user?.userType?.toLowerCase() === "admin") {
      return next();
    } else {
      throw new CustomError(req.t(translations.permission.isAdmin), 403);
    }
  },

  /* ---------------------------------- */
  /*               Account             */
  /* ---------------------------------- */
  isAccountOwner: async (req, res, next) => {
    try {
      if (!req.user || !req.user._id) {
        throw new CustomError(
          "Unauthorized: No user information available",
          401
        );
      }

      const account = await Account.findOne({ userId: req.params.id });

      if (!account) {
        throw new CustomError("Account not found", 404);
      }

      if (String(account.userId) === String(req.user._id)) {
        return next();
      } else {
        throw new CustomError("You are not the owner of this account", 403);
      }
    } catch (error) {
      next(error);
    }
  },

  /* ---------------------------------- */
  /*              Deposit              */
  /* ---------------------------------- */

  canMakeDeposit: async (req, res, next) => {
    const account = await Account.findById(req.body.accountId);

    if (!account) {
      throw new CustomError("Account not found", 404);
    }

    if (String(account.userId) === String(req.user._id)) {
      return next();
    } else {
      throw new CustomError("You cannot deposit to this account", 403);
    }
  },

  isDepositOwner: async (req, res, next) => {
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      throw new CustomError("Deposit not found", 404);
    }

    if (String(deposit.userId) === String(req.user._id)) {
      return next(); // User is the owner of this deposit
    } else {
      throw new CustomError("You are not the owner of this deposit", 403);
    }
  },

  /* ---------------------------------- */
  /*               Position             */
  /* ---------------------------------- */

  isPositionOwner: async (req, res, next) => {
    const position = await Position.findById(req.params.id);

    if (!position) {
      throw new CustomError("Position not found", 404);
    }

    if (String(position.userId) === String(req.user._id)) {
      return next(); // User is the owner of the position
    } else {
      throw new CustomError("You are not the owner of this position", 403);
    }
  },

  /* ---------------------------------- */
  /*                Trade               */
  /* ---------------------------------- */

  isTradeOwner: async (req, res, next) => {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      throw new CustomError("Trade not found", 404);
    }

    if (!req.user || !req.user._id) {
      throw new CustomError("User not authenticated", 401);
    }

    if (String(trade.userId) === String(req.user._id)) {
      return next();
    } else {
      throw new CustomError("You are not the owner of this trade", 403);
    }
  },

  canCreateTrade: async (req, res, next) => {
    const { accountId, positionId } = req.body;

    const account = await Account.findById(accountId);
    const position = await Position.findById(positionId);

    if (!account || !position) {
      throw new CustomError("Account or Position not found", 404);
    }

    if (
      String(account.userId) === String(req.user._id) &&
      String(position.userId) === String(req.user._id)
    ) {
      return next(); // User can create a trade with their account and position
    } else {
      throw new CustomError(
        "You do not own the required account or position",
        403
      );
    }
  },

  /* ---------------------------------- */
  /*          Generic Permissions      */
  /* ---------------------------------- */

  isUserOwnerOrAdmin: async (req, res, next) => {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new CustomError("User not found", 404);
    }

    if (
      String(user._id) === String(req.user._id) ||
      req.user.userType === "admin"
    ) {
      return next(); // User is either the owner or an admin
    } else {
      throw new CustomError("You are not the owner or an admin", 403);
    }
  },
};
