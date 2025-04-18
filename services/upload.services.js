const User = require("../models/User");
const ApiError = require("../utils/apiErrors");

const uploadService = async (req, res) => {
  try {
  

    if (!req.file) {
      throw new ApiError(400, "No file uploaded.");
    }

    const { originalname, filename } = req.file;

    const user = await User.findById(req.session.userId);
    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    user.image = {
      name: originalname,
      url: `/uploads/${filename}`,
    };

    await user.save();

    res.json({
      success: true,
      message: "uploaded successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { uploadService };

