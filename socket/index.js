const { createMessage } = require("../controllers/message.controller");

// sockets/index.js
const userMap = new Map();
module.exports = function (io) {
  io.on("connection", (socket) => {
    socket.on("register", (userId) => {
      userMap.set(userId, socket.id);
    });

    socket.on("message", async (data) => {
      const { from, to, message } = data;
      const savedMessage = await createMessage(data);

      const targetSocketId = userMap.get(to);
      if (targetSocketId) {
        io.to(targetSocketId).emit("message", {
          from,
          message,
          createdAt: savedMessage.createdAt,
        });
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, sockId] of userMap.entries()) {
        if (sockId === socket.id) userMap.delete(userId);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected:", socket.id);
    });
  });
};
