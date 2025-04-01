require("dotenv").config();
require("./config/db").connectDB();
const express = require("express");
const session = require("express-session");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error.middleware");
const helmet = require("helmet");
const csrfMiddleware = require("./middlewares/csrf.middleware");
const accessTokenMiddleware = require("./middlewares/accessToken.middleware");

const app = express();
const whitelist = ["http://localhost:5173"];
const PORT = process.env.PORT || 5000;

app.use(cookieParser());
app.use(express.json());
app.use(errorMiddleware);
app.use(csrfMiddleware);
app.use(accessTokenMiddleware);

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

app.use("/api/v1", authRoutes);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
