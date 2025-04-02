const helmet = require("helmet");

const security = helmet({
  contentSecurityPolicy: true,
  xssFilter: true,
  hsts: {
    maxAge: 63072000, // 2 years in seconds
    includeSubDomains: true,
    preload: true,
  },
  frameguard: {
    action: "deny",
  },
});

module.exports = security;
