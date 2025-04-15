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

const csrfToken = async (req, res) => {
  try {
    await auth.csrfTokenService(req, res);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

const accessToken = async (req, res) => {
  try {
    await auth.accessTokenService(req, res);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    await auth.getUserService(req, res);
  } catch (err) {
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    await auth.updateUserService(req, res);
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
  changePassword,
  forgotPassword,
  sendOtp,
  csrfToken,
  accessToken,
  getUser,
  updateUser,
};
