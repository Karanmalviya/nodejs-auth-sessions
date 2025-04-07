require("dotenv").config();
// require("./config/db");
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middlewares/error.middleware");
const csrfMiddleware = require("./middlewares/csrf.middleware");
const authMiddleware = require("./middlewares/auth.middleware");
const {corsMiddleware} = require("./config/cors");
const security = require("./config/security");
const sessions = require("./config/session");
const {connectDB} = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
app.use(express.json());
app.use(cookieParser());

app.use(security);
app.use(sessions);
app.use(corsMiddleware);

app.use(csrfMiddleware);
app.use(authMiddleware);

app.use("/api/v1", authRoutes);
app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.use(errorMiddleware);
