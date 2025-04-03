const User = require("../models/User");
const ApiError = require("../utils/apiErrors");
const { sendMail } = require("../helper/nodemailer");
const { createCsrfToken, hashToken } = require("../utils/csrf");
const { generateAccessToken, generateRefreshToken } = require("../helper/jwt");
const generateOTP = require("../utils/generateOtp");
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
    throw new ApiError(
      err.statusCode || 500,
      err.message || "Internal Server Error"
    );
  }
};

const loginService = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }
    if (user.passwordExpiry && user.passwordExpiry < new Date()) {
      throw new ApiError(401, "Password expired. Please reset your password.");
    }
    const now = new Date();
    if (user.blockUntil && user.blockUntil > now) {
      const timeLeft = Math.ceil((user.blockUntil - now) / (60 * 60 * 1000)); // hours remaining
      throw new ApiError(
        403,
        `Account temporarily blocked. Please try again in ${timeLeft} hour(s).`
      );
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      user.failedLoginAttempts += 1;
      if (user.failedLoginAttempts >= 3) {
        user.blockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Block for 24 hours
        await user.save();
        throw new ApiError(
          403,
          "Account temporarily blocked due to multiple failed attempts. Please try again after 24 hours."
        );
      }
      await user.save();
      throw new ApiError(
        401,
        `Invalid credentials. ${3 - user.failedLoginAttempts
        } attempt(s) remaining`
      );
    }

    user.failedLoginAttempts = 0;
    user.blockUntil = null;
    user.accessToken = generateAccessToken(res, user);
    user.refreshToken = generateRefreshToken(res, user);

    await user.save();
    req.session.userId = user._id;
    res.json({
      success: true,
      message: "Login successful",
    });
  } catch (err) {
    if (err.name === "MongoError") {
      throw new ApiError(500, "Database error occurred during login");
    }
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(500, "An unexpected error occurred during login");
  }
};

const logoutService = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      throw new ApiError(500, "Logout failed");
    }
    res.clearCookie("connect.sid");
    res.clearCookie("tokeb");
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
    user.passwordExpiry = new Date() + 90 * 24 * 60 * 60 * 1000;
    await user.save();
    res.json({ success: true, message: "Password changed successfully" });
  } catch (err) {
    throw new ApiError(500, "Failed to change password " + err.message);
  }
};

const forgotPasswordService = async (req, res) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    throw new ApiError(500, "Failed to send OTP: " + err.message);
  }
};

const sendOtpService = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const otp = generateOTP()

    const mailOptions = {
      from: `"InfinityOPS"${process.env.STMP_USER}`,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}. This OTP is valid for 15 minutes.`,
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong>. This OTP is valid for 15 minutes.</p>`,
    };

    user.otp = otp
    user.otpExpiry = Date.now() + 15 * 60 * 1000; // OTP valid for 15 minutes
    await Promise.all([sendMail(mailOptions.to, mailOptions.subject, mailOptions.html, user.save())])

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err) {
    throw new ApiError(500, "Failed to send OTP: " + err.message);
  }
};

const getProfileService = async (req, res) => {
  if (!req.session.userId) {
    throw new ApiError(401, "Session expired. Please login again.");
  }
  try {
    const user = await User.findById(req.session.userId).select(
      "_id name email"
    );
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res.json({ success: true, data: user });
  } catch (err) {
    throw new ApiError(500, "Failed to fetch profile");
  }
};

const csrfTokenService = async (req, res) => {
  try {
    const csrfToken = createCsrfToken();

    res.cookie("csrf_token", hashToken(csrfToken), {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ csrfToken });
  } catch (err) {
    throw new ApiError(500, "Failed to generate csrf token");
  }
};

const refreshTokenService = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies || req.body;
    const user1 = await User.findOne({ refreshToken });
    const user = await User.findOne({ refreshToken }).lean();
    if (!user) {
      throw new ApiError(403, "Invalid refresh token");
    }
    const accessToken = generateAccessToken(res, user);
    res.status(200).json({ accessToken });
  } catch (err) {
    throw new ApiError(500, "Failed to generate accessToken token");

  }
};

module.exports = {
  registerService,
  loginService,
  changePasswordService,
  logoutService,
  getProfileService,
  forgotPasswordService,
  sendOtpService,
  csrfTokenService,
  refreshTokenService,
};
