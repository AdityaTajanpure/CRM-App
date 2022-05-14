const express = require("express");
const asyncHandler = require("express-async-handler");
const MongoConnection = require("../config/db");
const { hashPassword, verifyPassword } = require("../config/crypt");
const nodemailer = require("nodemailer");

var client = MongoConnection.connection;

const loginUser = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  if (!username || !password) {
    res.json({
      status: false,
      msg: "Invalid username or password",
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
      let userPassword = user.password;
      if (await verifyPassword(password, userPassword)) {
        //Password matched
        delete user.password;
        res.json({ status: true, msg: "Logged in successfully", data: user });
      } else {
        //Password not matched
        res.status(404).json({
          status: false,
          msg: "Invalid username or password",
          data: null,
        });
      }
    }
  }
});

const signUp = asyncHandler(async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let firstname = req.body.firstname;
  let lastname = req.body.lastname;
  if (!username || !password || !firstname) {
    res.json({
      status: false,
      msg: "Fill all required fields",
    });
  } else {
    let user = await client
      .db("crm")
      .collection("users")
      .findOne({ username: username });
    if (user) {
      //Existing User found
      res.status(404).json({
        status: false,
        msg: "Email id already exists in our database",
        data: null,
      });
    } else {
      //Create New User
      let hashedPassword = await hashPassword(password);
      await client.db("crm").collection("users").insertOne({
        username,
        password: hashedPassword,
        firstname,
        lastname,
        isActive: true,
      });
      let user = await client
        .db("crm")
        .collection("users")
        .findOne({ username });
      delete user.password;
      res.json({
        status: true,
        msg: "User Created Successfully",
        data: user,
      });
    }
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  let username = req.body.username;
  if (!username) {
    res.json({ status: false, msg: "Invalid email address" });
  } else {
    let user = await client.db("crm").collection("users").findOne({ username });
    if (!user) {
      res.json({ status: false, msg: "User not found!" });
    } else {
      const authObject = {
        service: "gmail",
        port: 465,
        auth: {
          type: "OAuth2",
          user: process.env.MAIL_USER,
          password: process.env.MAIL_PASS,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
        },
        tls: {
          rejectUnauthorized: false,
        },
      };

      console.log(authObject);
      let transporter = nodemailer.createTransport(authObject);
      let mailOptions = {
        from: process.env.MAIL_UESR,
        to: username,
        subject: "CRM App",
        text: "Hello, you can create a new password for your account here\nURL",
      };
      transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
          res.json({ Error: err });
        } else {
          res.json({
            status: true,
            msg: "Email sent successfully",
            data,
          });
        }
      });
    }
  }
});

module.exports = { loginUser, signUp, forgotPassword };
