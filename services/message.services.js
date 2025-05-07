const { default: mongoose } = require("mongoose");
const Message = require("../models/message.model");
const User = require("../models/User");
const ApiError = require("../utils/apiErrors");

async function createMessageService(data) {
  const { from, to, message } = data;
  return await Message.create({ from, to, message });
}

async function updateMessageService(req, res) {
  const { from, to, message } = req.body;

  if (!from || !to || !message) {
    throw new ApiError(400, "All fields are required!");
  }
  if (req.session.userId !== from) {
    throw new ApiError(403, "You are not authorized to update this message!");
  }
  const [fromUser, toUser] = await Promise.all([
    User.findById(from),
    User.findById(to),
  ]);

  if (!fromUser && !toUser) {
    throw new ApiError(404, "User not found!");
  }

  try {
    await Message.create({ from, to, message });
    res
      .status(201)
      .json({ success: true, message: "Message Save Successfully!" });
  } catch (err) {
    throw new ApiError(
      err.statusCode || 500,
      err.message || "Internal Server Error"
    );
  }
}

async function getMessagesService(req, res) {
  const { from, to, page = 1, pageSize = 10 } = req.query;
  const skip = (+page - 1) * +pageSize;
  const fromId = mongoose.Types.ObjectId.createFromHexString(from);
  const toId = mongoose.Types.ObjectId.createFromHexString(to);

  const data = await Message.aggregate([
    {
      $match: {
        $or: [
          { from: fromId, to: toId },
          { from: toId, to: fromId },
        ],
      },
    },
    { $sort: { createdAt: 1 } },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: +pageSize }],
        totalCount: [{ $count: "count" }],
      },
    },
    {
      $project: {
        data: 1,
        totalCount: {
          $ifNull: [{ $arrayElemAt: ["$totalCount.count", 0] }, 0],
        },
      },
    },
  ]);
  res.status(201).json({
    success: true,
    page: +page,
    pageSize: +pageSize,
    totalCount: data[0].totalCount,
    totalPages: Math.ceil(data[0].totalCount / +pageSize),
    data: data[0].data,
  });
  try {
  } catch (err) {
    throw new ApiError(
      err.statusCode || 500,
      err.message || "Internal Server Error"
    );
  }
}

module.exports = {
  createMessageService,
  updateMessageService,
  getMessagesService,
};
