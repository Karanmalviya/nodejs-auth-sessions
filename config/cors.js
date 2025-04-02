const cors = require("cors");
const whitelist = ["http://localhost:5173"];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
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
