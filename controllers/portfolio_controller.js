const asyncHandler = require("express-async-handler");
const MongoConnection = require("../config/db");

var client = MongoConnection.connection;

const addView = asyncHandler(async (req, res) => {
  let identifier = req.body.identifier;
  await client.db("portfolio").collection("visits").insertOne({
    identifier: identifier,
  });
  let response = await client
    .db("portfolio")
    .collection("visits")
    .distinct("identifier");

  let count = response.length;

  res.json({
    status: true,
    title: "Success",
    message: "View added successfully",
    data: count,
  });
});

const addDownload = asyncHandler(async (req, res) => {
  let identifier = req.body.identifier;
  await client.db("portfolio").collection("downloads").insertOne({
    identifier: identifier,
  });
  let response = await client
    .db("portfolio")
    .collection("downloads")
    .distinct("identifier");

  let count = response.length;
  res.json({
    status: true,
    title: "Success",
    message: "Download added successfully",
    data: count,
  });
});

module.exports = {
  addView,
  addDownload,
};
