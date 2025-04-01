const ApiError = require("../utils/apiErrors");

const accessTokenMiddleware = (req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token;

    if (!token) {
      throw new ApiError(401, "Access token required");
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      throw new ApiError(401, "Invalid access token");
    }
  }
  next();
};

module.exports = accessTokenMiddleware;
