const session = require("express-session");
const convertToMilliseconds = require("../helper/convertToMilliseconds");

const sessions = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: convertToMilliseconds(process.env.SESSION_EXPIRY),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  },
});

module.exports = sessions;
//
