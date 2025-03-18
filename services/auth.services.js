const User = require("../models/User");
const ApiError = require("../utils/apiErrors");

const registerService = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new ApiError(400, "Required fields are missing");
  }
  try {
    const user = new User({ name, email, password, previousPasswords: [] });
    await user.save();
    req.session.userId = user._id;
    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (err) {
    if (err.code === 11000) {
      throw new ApiError(409, "The email is already registered.");
    }
    throw new ApiError(500, "Internal Server Error");
  }
};

const loginService = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Required fields are missing");
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials");
    }
    req.session.userId = user._id;
    res.json({ success: true, message: "Login successful" });
  } catch (err) {
    throw new ApiError(401, "Login failed");
  }
};

const logoutService = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw new ApiError(500, "Logout failed");
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logout successful" });
  });
};

const changePasswordService = async (req, res) => {
  if (!req.session.userId) {
    throw new ApiError(401, "Session expired. Please login again.");
  }
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new ApiError(400, "Required fields are missing");
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user || !(await user.comparePassword(currentPassword))) {
      throw new ApiError("Invalid current password");
    }
    const isPreviousPassword = await Promise.all(
      user.previousPasswords.map(
        async () => await user.comparePassword(newPassword)
      )
    );
    if (isPreviousPassword.includes(true)) {
      throw new ApiError(
        422,
        "You cannot use one of your last five passwords. Please choose a new password."
      );
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    throw new ApiError(500, "Failed to change password " + err.message);
  }
};

const getProfileService = async (req, res) => {
  if (!req.session.userId) {
    throw new ApiError(401, "Session expired. Please login again.");
  }
  try {
    const user = await User.findById(req.session.userId).select(
      "-password -previousPasswords -__v"
    );
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res.json({ success: true, data: user });
  } catch (err) {
    throw new ApiError(500, "Failed to fetch profile");
  }
};

module.exports = {
  registerService,
  loginService,
  changePasswordService,
  logoutService,
  getProfileService,
};
