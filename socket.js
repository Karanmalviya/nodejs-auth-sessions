const { Server } = require("socket.io");
const { server } = require("./app");
const constants = require("./constants");

const io = new Server(server, {
  cors: {
    origin: constants.WHITE_LIST_DOMAIN,
  },
});

io.on("conn", (socket) => {
  console.log("Connected to socket.io server");
  socket.on("message", (data) => {
    console.log("Received message:", data);
    socket.emit("message", "Hello from server!");
  });
});
