// sockets/index.js
module.exports = function (io) {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("message", (data) => {
      console.log("Received:", data);
      socket.emit("reply", `Server received: ${data}`);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
};
