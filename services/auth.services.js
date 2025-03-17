const User = require("../models/User");

const registerService = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new Error("Required fields are missing");
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
      throw new Error("The email is already registered.");
    }
    throw new Error("Internal Server Error");
  }
};

const loginService = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }
    req.session.userId = user._id;
    res.json({ success: true, message: "Login successful" });
  } catch (err) {
    throw new Error("Login failed");
  }
};

const logoutService = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw new Error("Logout failed");
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logout successful" });
  });
};

const changePasswordService = async (req, res) => {
  if (!req.session.userId) {
    throw new Error("Session expired. Please login again.");
  }
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    throw new Error("Required field are missing");
  }
  try {
    const user = await User.findById(req.session.userId);
    if (!user || !(await user.comparePassword(currentPassword))) {
      throw new Error("Invalid current password");
    }
    const isPreviousPassword = await Promise.all(
      user.previousPasswords.map(
        async () => await user.comparePassword(newPassword)
      )
    );
    if (isPreviousPassword.includes(true)) {
      throw new Error("Cannot use one of the last five passwords");
    }
    user.password = newPassword;
    await user.save();
    res.json({ message: "Password changed successfully" });
  } catch (err) {
    throw new Error("Failed to change password " + err.message);
  }
};

module.exports = {
  registerService,
  loginService,
  changePasswordService,
  logoutService,
};
