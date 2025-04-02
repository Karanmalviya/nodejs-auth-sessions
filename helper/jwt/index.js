require("dotenv").config();
const jwt = require("jsonwebtoken");

function convertToMilliseconds(timeString) {
  const timeValue = parseInt(timeString);
  if (timeString.includes("d")) return timeValue * 24 * 60 * 60 * 1000;
  if (timeString.includes("h")) return timeValue * 60 * 60 * 1000;
  if (timeString.includes("m")) return timeValue * 60 * 1000;
  if (timeString.includes("s")) return timeValue * 1000;
  return timeValue;
}

module.exports.generateAccessToken = (res, user) => {
  const accessToken = jwt.sign(
    { id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );

  res.cookie("accessToken", accessToken, {
    maxAge: convertToMilliseconds(process.env.ACCESS_TOKEN_EXPIRY),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });
  return accessToken;
};

module.exports.generateRefreshToken = (res, user) => {
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );

  res.cookie("refreshToken", refreshToken, {
    maxAge: convertToMilliseconds(process.env.REFRESH_TOKEN_EXPIRY),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });
  return refreshToken;
};
