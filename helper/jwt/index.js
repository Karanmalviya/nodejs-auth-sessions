require("dotenv").config();
const jwt = require("jsonwebtoken");
const convertToMilliseconds = require("../convertToMilliseconds");
const constants = require("../../constants");

module.exports.generateAccessToken = (res, user) => {
  const accessToken = jwt.sign(
    { id: user._id },
    constants.ACCESS_TOKEN_SECRET,
    { expiresIn: constants.ACCESS_TOKEN_EXPIRY }
  );

  res.cookie("accessToken", accessToken, {
    maxAge: convertToMilliseconds(constants.ACCESS_TOKEN_EXPIRY),
    secure: constants.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });
  return accessToken;
};

module.exports.generateRefreshToken = (res, user) => {
  const refreshToken = jwt.sign(
    { id: user._id },
    constants.REFRESH_TOKEN_SECRET,
    { expiresIn: constants.REFRESH_TOKEN_EXPIRY }
  );

  res.cookie("refreshToken", refreshToken, {
    maxAge: convertToMilliseconds(constants.REFRESH_TOKEN_EXPIRY),
    secure: constants.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "strict",
  });
  return refreshToken;
};
