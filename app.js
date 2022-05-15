const express = require("express");
require("dotenv").config();
const MongoConnection = require("./config/db");
const { errorHandler } = require("./middleware/error_handler");
const cors = require("cors");

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(errorHandler);

//Created a singleton for later access
MongoConnection.connect();

app.listen(port, () => console.log(`Server started on port ${port}`));

app.use(cors());

app.use("/onboarding", require("./routes/onboarding_routes"));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH");
  next();
});

app.use("/services", require("./routes/service_routes"));
app.use("/leads", require("./routes/leads_routes"));
app.use("/contacts", require("./routes/contacts_routes"));
