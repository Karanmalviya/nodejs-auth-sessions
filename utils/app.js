// require("dotenv").config();
// require("./config/db").connectDB();
// const express = require("express");
// const cookieParser = require("cookie-parser");
// const errorMiddleware = require("./middlewares/error.middleware");
// const csrfMiddleware = require("./middlewares/csrf.middleware");
// const authMiddleware = require("./middlewares/auth.middleware");
// const { corsMiddleware } = require("./config/cors");
// const security = require("./config/security");
// const sessions = require("./config/session");
// const constants = require("./constants");
// const routers = require("./routes");
// const path = require("path");
// const http = require("http");

// const app = express();
// const PORT = constants.PORT;
// const server = http.createServer(app);

// app.use(express.json());
// app.use(cookieParser());

// app.use(security);
// app.use(sessions);
// app.use(corsMiddleware);

// app.use(csrfMiddleware);
// app.use(authMiddleware);

// app.use("/api/v1/uploads", express.static(path.join(__dirname, "uploads")));
// app.use("/api/v1", routers);

// app.get("/", (req, res) => {
//   res.send("Hello");
// });

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

// app.use(errorMiddleware);
