const ApiError = require("../utils/apiErrors");
const jwt = require("jsonwebtoken");

const publicRoutes = [
  "/register",
  "/login",
  "/send-otp",
  "/forgot-password",
  "/csrf-token",
  "/refresh-token",
];
const authMiddleware = (req, res, next) => {
  const isPublicRoute = publicRoutes.some((route) => req.path.endsWith(route));
  const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

  if (isPublicRoute) {
    return next();
  }
  if (!token) {
    throw new ApiError(401, "Access token required");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return next();
  } catch (err) {
    res.clearCookie("token");
    throw new ApiError(403, "Invalid or expired access token");
  }
};

module.exports = authMiddleware;
