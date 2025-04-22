const constants = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,
  MONGO_URI: process.env.MONGO_URI,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_FROM: process.env.SMTP_FROM,
  STMP_USER: process.env.SMTP_USER,
  SMTP_PASWORD: process.env.SMTP_PASWORD,
  CSRF_SECRET: process.env.CSRF_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  SESSION_EXPIRY: process.env.SESSION_EXPIRY,
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  ACCESS_TOKEN_EXPIRY: process.env.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRY: process.env.REFRESH_TOKEN_EXPIRY,
  WHITE_LIST_DOMAIN: JSON.parse(process.env.WHITE_LIST_DOMAIN),
};
module.exports = constants;
