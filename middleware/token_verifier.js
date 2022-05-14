const jwt = require("jsonwebtoken");

const tokenVerifier = (req, res, next) => {
  try {
    const token = req.headers["x-auth-token"];
    jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
};

module.exports = {
  tokenVerifier,
};
