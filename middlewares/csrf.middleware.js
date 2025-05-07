const { hashToken } = require("../utils/csrf");

const csrfMiddleware = (req, res, next) => {
  if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) {
    const csrfTokenClient = req.headers["x-csrf-token"];
    const { csrf_token } = req.cookies;
    if (!csrfTokenClient && !csrf_token) {
      return res.status(403).json({
        success: false,
        message: "Missing CSRF token",
      });
    }
    const csrfTokenClientHash = hashToken(csrfTokenClient);
    if (csrfTokenClientHash !== csrf_token) {
      return res.status(403).json({
        success: false,
        message: "Invalid CSRF token",
      });
    }
    return next();
  }
  next();
};

module.exports = csrfMiddleware;
