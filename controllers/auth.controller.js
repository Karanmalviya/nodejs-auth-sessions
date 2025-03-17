const User = require("../models/User");
const {
  registerService,
  loginService,
  changePasswordService,
  logoutService,
} = require("../services/auth.services");

const register = async (req, res) => {
  try {
    await registerService(req, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    await loginService(req, res);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    await changePasswordService(req, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    await logoutService(req, res);
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const getProfile = async (req, res) => {
  if (!req.session.userId) {
    return res
      .status(401)
      .json({ error: "Session expired. Please login again." });
  }
  try {
    const user = await User.findById(req.session.userId).select(
      "-password -previousPasswords"
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch profile", details: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  changePassword,
};
