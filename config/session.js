const session = require("express-session");

const sessions = session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 10 * 60 * 1000, // 10 minutes
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  },
});

module.exports = sessions;
// 