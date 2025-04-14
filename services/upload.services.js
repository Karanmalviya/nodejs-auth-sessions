const User = require("../models/User");
const ApiError = require("../utils/apiErrors");

const uploadService = async (req, res) => {
  try {
    if (!req.session?.userId) {
      throw new ApiError(401, "Session expired. Please login again.");
    }

    if (!req.file) {
      throw new ApiError(400, "No file uploaded.");
    }

    const { filename } = req.file;

    const user = await User.findById(req.session.userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    user.image = {
      name: filename,
      url: `/uploads/${filename}`,
    };

    await user.save();

    res.status(201).json({
      message: "✅ File uploaded successfully",
      image: user.image,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadService };
