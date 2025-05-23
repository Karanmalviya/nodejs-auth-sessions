const crypto = require("crypto");
const constants = require("../constants");

const createCsrfToken = () => {
  return crypto.randomBytes(32).toString("hex"); // Generate a random 32-byte token
};

const hashToken = (token) => {
  return crypto
    .createHmac("sha256", constants.CSRF_SECRET)
    .update(token)
    .digest("hex"); // Hash the token using HMAC with SHA-256
};

module.exports = { createCsrfToken, hashToken };
