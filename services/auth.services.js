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
    throw new ApiError(
      err.statusCode || 500,
      err.message || "Internal Server Error"
    );
  }
};

// const loginService = async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password) {
//     throw new ApiError(400, "Required fields are missing");
//   }
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       throw new ApiError(401, "Invalid credentials");
//     }
//     // Check if the user is blocked
//     if (user.blockUntil && user.blockUntil > new Date()) {
//       throw new ApiError(
//         403,
//         `Account blocked. Try again after ${user.blockUntil}.`
//       );
//     }
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       // Increment failed login attempts
//       user.failedLoginAttempts += 1;

//       // Block the user if failed attempts reach 3
//       if (user.failedLoginAttempts >= 3) {
//         user.blockUntil = new Date(Date.now() + 24 * 60 * 60 * 1000); // Block for 24 hours
//       }

//       await user.save();

//       throw new ApiError(
//         401,
//         `Invalid credentials. Attempts left: ${3 - user.failedLoginAttempts}`
//       );
//       // throw new ApiError(401, "Invalid credentials");
//     }
//     // Reset failed attempts and block status on successful login
//     user.failedLoginAttempts = 0;
//     user.blockUntil = null;
//     req.session.userId = user._id;
//     res.json({ success: true, message: "Login successful" });
//   } catch (err) {
//     throw new ApiError(err.statusCode || 401, err.message || "Login failed");
//   }
// };


const loginService = async (req, res) => {
  const { email, password } = req.body;
  
  // Validate input
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, "Invalid credentials");
    }

    // Check if the user is blocked
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
      // Increment failed login attempts
      user.failedLoginAttempts += 1;

      // Block the user if failed attempts reach 3
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
        `Invalid credentials. ${3 - user.failedLoginAttempts} attempt(s) remaining`
      );
    }

    // Reset failed attempts and block status on successful login
    user.failedLoginAttempts = 0;
    user.blockUntil = null;
    await user.save();

    // Create session
    req.session.userId = user._id;
    
    // Omit sensitive data from response
    const userData = {
      id: user._id,
      email: user.email,
      // add other non-sensitive user fields as needed
    };

    res.json({ 
      success: true, 
      message: "Login successful",
      user: userData
    });
  } catch (err) {
    // Handle specific database errors
    if (err.name === 'MongoError') {
      throw new ApiError(500, "Database error occurred during login");
    }
    
    // Re-throw ApiError instances, create new ones for other errors
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
