const express = require("express");
const authController = require("../controllers/auth.controller");
const validateRequest = require("../middlewares/validateRequest.middleware");
const { registerValidation } = require("../validations/auth.validation");
const rateLimit = require("express-rate-limit");

const router = express.Router();
const authRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 10,
  keyGenerator: (req, res) => req.body.email || req.ip,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

router.post(
  "/register",
  authRateLimit,
  registerValidation,
  validateRequest,
  authController.register
);

router.post("/login", authRateLimit, authController.login);
router.post("/change-password", authController.changePassword);
router.post("/forgot-password", authController.forgotPassword);
router.post("/send-otp", authController.sendOtp);
router.get("/csrf-token", authController.csrfToken);
router.get("/refresh-token", authController.refreshToken);

router.post("/logout", authController.logout);
router.get("/user", authController.getProfile);

module.exports = router;
