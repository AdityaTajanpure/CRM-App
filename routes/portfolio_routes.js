const { addView, addDownload } = require("../controllers/portfolio_controller");
const express = require("express");

const router = express.Router();

router.post("/addView", addView);

router.post("/addDownload", addDownload);

module.exports = router;
