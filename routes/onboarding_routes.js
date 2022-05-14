const express = require("express");
const {
  loginUser,
  signUp,
  forgotPassword,
} = require("../controllers/onboarding_controller");
const router = express.Router();

router.post("/login", loginUser);

router.post("/signUp", signUp);

router.post("/forgotPassword", forgotPassword);

module.exports = router;
