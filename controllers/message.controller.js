const message = require("../services/message.services");

const createMessage = async (data) => {
  await message.createMessageService(data);
};

const updateMessage = async (req, res) => {
  try {
    await message.updateMessageService(req, res);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

const getMessages = async (req, res) => {
  try {
    await message.getMessagesService(req, res);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

module.exports = { createMessage, updateMessage, getMessages };
