require("dotenv").config();
require("./config/db").connectDB();

const http = require("http");
const { Server } = require("socket.io");
const constants = require("./constants");
const app = require("./app");
const socketHandler = require("./socket");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: constants.WHITE_LIST_DOMAIN,
    credentials: true,
  },
});

socketHandler(io);

server.listen(constants.PORT, () => {
  console.log(`Server running on http://localhost:${constants.PORT}`);
});
