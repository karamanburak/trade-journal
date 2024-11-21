"use strict";

const { CustomError } = require("../errors/customError");
const User = require("../models/user");

module.exports = {
  list: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "List Users"
      #swagger.description = `
        You can send query with endpoint for search[], sort[], page and limit.
        <ul> Examples:
            <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
            <li>URL/?<b>sort[field1]=1&sort[field2]=-1</b></li>
            <li>URL/?<b>page=2&limit=1</b></li>
        </ul>
      `
      #swagger.responses[200] = {
        description: 'List of users retrieved successfully',
        schema: {
          error: false,
          details: { type: 'array', items: { type: 'object' } },
          data: [{ _id: 'user-id', email: 'user-email', firstName: 'User Name',  ...other }]
        }
      }
    */

    let listFilter = {};

    const data = await res.getModelList(User, listFilter);
    res.status(200).send({
      error: false,
      details: await res.getModelListDetails(User, listFilter),
      data,
    });
  },
  read: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Get Single User"
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'string'
      }
      #swagger.responses[200] = {
        description: 'User retrieved successfully',
        schema: {
          error: false,
          data: { _id: 'user-id', email: 'user-email', firstName: 'User Name', ...other }
        }
      }
    */

    const data = await User.findOne({ _id: req.params.id });
    res.status(200).send({
      error: false,
      data,
    });
  },
  update: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Update User"
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'string'
      }
      #swagger.parameters['body'] = {
          in: 'body',
          required: true,
          schema: {
              $ref: "#/definitions/User"
          }
      }
      #swagger.responses[202] = {
        description: 'User updated successfully',
        schema: {
          error: false,
          message: 'Profile information has been updated successfully.',
          new: { _id: 'user-id', email: 'user-email', firstName: 'User Name', ...other },
          data: { _id: 'user-id', email: 'user-email', firstlName: 'User Name' }
        }
      }
      #swagger.responses[400] = {
        description: 'Validation error or email already exists',
        schema: {
          error: true,
          message: 'Validation error message'
        }
      }
      #swagger.responses[401] = {
        description: 'Incorrect current password',
        schema: {
          error: true,
          message: 'Please provide correct current password!'
        }
      }
    */

    if (req.body.email) {
      const existingUser = await User.findOne({
        email: req.body.email,
      });
      if (existingUser && existingUser._id.toString() !== req.params.id) {
        throw new CustomError("Email already exists!", 400);
      }
    }
    const data = await User.findOneAndUpdate({ _id: req.params.id }, req.body, {
      runValidators: true,
    });
    res.status(202).send({
      error: False,
      message: "Profile information has been updated successfully.",
      new: await User.findOne({ _id: req.params.id }),
      data,
    });
  },
  delete: async (req, res) => {
    /*
      #swagger.tags = ["Users"]
      #swagger.summary = "Delete User"
      #swagger.parameters['id'] = {
        in: 'path',
        description: 'User ID',
        required: true,
        type: 'string'
      }
      #swagger.responses[204] = {
        description: 'User deleted successfully',
        schema: {
          error: false,
          message: 'Account successfully deleted!'
        }
      }
      #swagger.responses[400] = {
        description: 'Bad Request',
        schema: {
          error: true,
          message: 'Error message'
        }
      }
    */

    const data = await User.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
      message: data.deletedCount
        ? "Account successfully deleted!"
        : "User not found!",
    });
  },
};
