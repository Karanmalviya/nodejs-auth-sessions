const User = require("../models/User");
const auth = require("../services/auth.services");

const register = async (req, res) => {
  try {
    await auth.registerService(req, res);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

const login = async (req, res) => {
  try {
    await auth.loginService(req, res);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

const changePassword = async (req, res) => {
  try {
    await auth.changePasswordService(req, res);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    await auth.forgotPasswordService(req, res);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

const sendOtp = async (req, res) => {
  try {
    await auth.sendOtpService(req, res);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

const logout = async (req, res) => {
  try {
    await auth.logoutService(req, res);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    await auth.getProfileService(req, res);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

const csrf = async (req, res) => {
  try {
    await auth.csrfService(req, res);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  getProfile,
  changePassword,
  forgotPassword,
  sendOtp,
  csrf,
};
