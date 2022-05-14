const express = require("express");
require("dotenv").config();
const MongoConnection = require("./config/db");
const { errorHandler } = require("./middleware/error_handler");

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(errorHandler);

//Created a singleton for later access
MongoConnection.connect();

app.listen(port, () => console.log(`Server started on port ${port}`));

app.use("/onboarding", require("./routes/onboarding_routes"));
