const express = require("express");
const connectDB = require("./config/db");
const session = require("express-session");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const errorMiddleware = require("./middlewares/errorMiddleware");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

app.use(cookieParser());
app.use(csurf({ cookie: true }));
app.use(errorMiddleware);
app.use(express.json());
const whitelist = ["http://localhost:5173"];

// const rateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 2,
//   message: {
//     success: false,
//     message: "Too many requests, please try again later.",
//   },
//   skip: (req, res) => whitelist.includes(req.ip),
// });

// app.use(rateLimiter);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error());
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
app.use(helmet({ contentSecurityPolicy: true, xssFilter: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 10 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
    },
  })
);

app.use("/api", authRoutes);
app.get("/api/csrf-token", (req, res) => {
  res.status(201).json({ csrfToken: req.csrfToken() });
});

app.get("/hello", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
