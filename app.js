const express = require("express");
const session = require("express-session");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");
const ApiError = require("./utils/apiErrors");
require("dotenv").config();

const app = express();
connectDB();

const whitelist = [
  "http://localhost:5173",
  "https://trusted-domain.com",
  "https://another-trusted-domain.com",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new ApiError(403, "Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use((req, res, next) => {
  cors(corsOptions)(req, res, (err) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: "CORS Error: Not allowed by CORS",
      });
    }
    next();
  });
});
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 10 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
    },
  })
);

app.use("/api", authRoutes);

app.get("/hello", (req, res) => {
  res.send("Hello");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
