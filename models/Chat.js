const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    from: {
      type: String, 
      required: true,
    },
    to: {
      type: String,
      required: true,
    }, 
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

module.exports = mongoose.model("Message", messageSchema);
