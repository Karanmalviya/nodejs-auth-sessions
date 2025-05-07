const express = require("express");
const messageController = require("../controllers/message.controller");

const router = express.Router();

router
  .route("/message")
  .get(messageController.getMessages)
  .post(messageController.createMessage)
  .put(messageController.updateMessage);

module.exports = router;
