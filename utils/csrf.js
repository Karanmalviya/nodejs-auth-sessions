const crypto = require("crypto");

const createCsrfToken = () => {
  return crypto.randomBytes(32).toString("hex"); // Generate a random 32-byte token
};

const hashToken = (token) => {
  return crypto
    .createHmac("sha256", process.env.CSRF_SECRET)
    .update(token)
    .digest("hex"); // Hash the token using HMAC with SHA-256
};

module.exports = {createCsrfToken, hashToken};
