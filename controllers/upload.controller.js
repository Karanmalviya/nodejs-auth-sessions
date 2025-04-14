const { uploadService } = require("../services/upload.services");

const uploadController = async (req, res) => {
  try {
    await uploadService(req, res);
  } catch (error) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

module.exports = { uploadController };
