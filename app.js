const express = require("express");
const dotenv = require("dotenv").config();
const connect = require("./db/config");
const { errorHandler } = require("./middleware/error_handler");

const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(errorHandler);

connect();

app.listen(port, () => console.log(`Server started on port ${port}`));
