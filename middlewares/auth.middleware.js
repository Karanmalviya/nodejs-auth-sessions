const constants = require("../constants");
const ApiError = require("../utils/apiErrors");
const jwt = require("jsonwebtoken");

const publicRoutes = [
  "/register",
  "/login",
  "/send-otp",
  "/forgot-password",
  "/csrf-token",
  "/access-token",
];

const authMiddleware = (req, res, next) => {
  const isPublicRoute = publicRoutes.some((route) => req.path.endsWith(route));
  const accessToken =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];
  if (isPublicRoute) {
    return next();
  }
  if (!req.session.userId) {
    throw new ApiError(401, "Session expired. Please login again.");
  }

  if (!accessToken) {
    throw new ApiError(401, "Access token required");
  }

  try {
    const decoded = jwt.verify(accessToken, constants.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    res.clearCookie("accessToken");
    throw new ApiError(403, "Invalid or expired access token");
  }
};

module.exports = authMiddleware;
