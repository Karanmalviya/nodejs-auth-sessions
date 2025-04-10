const session = require("express-session");
const convertToMilliseconds = require("../helper/convertToMilliseconds");
const constants = require("../constants");

const sessions = session({
  secret: constants.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: convertToMilliseconds(constants.SESSION_EXPIRY),
    secure: constants.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  },
});

module.exports = sessions;
//
