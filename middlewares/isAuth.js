const jwt = require("jsonwebtoken");
const User = require("../models/User");
const NotAuthorizedError = require("../errors/not-authorized");
const isAuth = async (req, res, next) => {
  let token;

  if (req.headers.auth_token && req.headers.auth_token.startsWith("MYSHOP")) {
    // set token for token header
    token = req.headers.auth_token.split(" ")[1];
    // set token from cookie
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) throw new NotAuthorizedError();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    throw new NotAuthorizedError();
  }
};

module.exports = isAuth;
