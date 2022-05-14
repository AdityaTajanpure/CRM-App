const express = require("express");
const asyncHandler = require("express-async-handler");
const MongoConnection = require("../config/db");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { tokenVerifier } = require("../middleware/token_verifier");

var client = MongoConnection.connection;

const addContactRecord = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let title = req.body.title;
  let mobileNumber = req.body.mobileNumber;
  let description = req.body.description;

  if (!username || !title || !mobileNumber) {
    res.json({
      status: false,
      msg: "Invalid request",
    });
  } else {
    let user = await client.db("crm").collection("users").findOne({ username });
    if (!user) {
      //User not found
      res.status(404).json({
        status: false,
        msg: "User not found",
        data: null,
      });
    } else {
      let serviceRecord = await client
        .db("crm")
        .collection("contacts")
        .insertOne({
          title,
          mobileNumber,
          description,
          created_by: user.firstname,
        });
      res.json({
        status: true,
        msg: "Service record created successfully",
      });
    }
  }
});

const updateContactRecord = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let _id = req.body._id;
  let title = req.body.title;
  let mobileNumber = req.body.mobileNumber;
  let description = req.body.description;

  if (!username || !title || !mobileNumber || !_id) {
    res.json({
      status: false,
      msg: "Invalid request",
    });
  } else {
    let user = await client.db("crm").collection("users").findOne({ username });
    if (!user) {
      //User not found
      res.status(404).json({
        status: false,
        msg: "User not found",
        data: null,
      });
    } else {
      let serviceRecord = await client
        .db("crm")
        .collection("contacts")
        .updateOne(
          { _id: ObjectId(_id) },
          {
            $set: {
              title,
              mobileNumber,
              description,
              created_by: user.firstname,
            },
          }
        );
      res.json({
        status: true,
        msg: "Service record updated successfully",
        data: serviceRecord,
      });
    }
  }
});

const deleteContactRecord = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let _id = req.body._id;

  if (!username || !_id) {
    res.json({
      status: false,
      msg: "Invalid request",
    });
  } else {
    let user = await client.db("crm").collection("users").findOne({ username });
    if (!user) {
      //User not found
      res.status(404).json({
        status: false,
        msg: "User not found",
        data: null,
      });
    } else {
      let serviceRecord = await client
        .db("crm")
        .collection("contacts")
        .findOneAndDelete({ _id: ObjectId(_id) });
      res.json({
        status: true,
        msg: "Service record deleted successfully",
      });
    }
  }
});

const getContactRecords = asyncHandler(async (req, res) => {
  let username = req.body.username;

  if (!username) {
    res.json({
      status: false,
      msg: "Invalid request",
    });
  } else {
    let user = await client.db("crm").collection("users").findOne({ username });
    if (!user) {
      //User not found
      res.status(404).json({
        status: false,
        msg: "User not found",
        data: null,
      });
    } else {
      let serviceRecord = await client
        .db("crm")
        .collection("contacts")
        .find()
        .toArray();
      res.json({
        status: true,
        msg: "Service record fetched successfully",
        data: serviceRecord,
      });
    }
  }
});

module.exports = {
  addContactRecord,
  updateContactRecord,
  deleteContactRecord,
  getContactRecords,
};
