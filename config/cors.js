const cors = require("cors");
const constants = require("../constants");

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || constants.WHITE_LIST_DOMAIN.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "X-CSRF-Token"],
  credentials: true,
};

const corsMiddleware = (req, res, next) => {
  cors(corsOptions)(req, res, (err) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "CORS Error: Not allowed by CORS",
      });
    }
    next();
  });
};

module.exports = { corsMiddleware };
