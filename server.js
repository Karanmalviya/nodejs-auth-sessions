require("dotenv").config();
require("./config/db").connectDB();
const constants = require("./constants");
const express = require("express");
const cookieParser = require("cookie-parser");
const csrfMiddleware = require("./middlewares/csrf.middleware");
const authMiddleware = require("./middlewares/auth.middleware");
const errorMiddleware = require("./middlewares/error.middleware");
const { corsMiddleware } = require("./config/cors");
const security = require("./config/security");
const sessions = require("./config/session");
const routers = require("./routes");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(security);
app.use(sessions);
app.use(corsMiddleware);
app.use(csrfMiddleware);
app.use(authMiddleware);

app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/v1", routers);
app.get("/", (req, res) => res.send("Hello"));

app.listen(constants.PORT, () => {
  console.log(`Server running on http://localhost:${constants.PORT}`);
});

app.use(errorMiddleware);
