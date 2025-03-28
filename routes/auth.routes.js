const express = require("express");
const authController = require("../controllers/auth.controller");
const validateRequest = require("../middlewares/validateRequest");
const { registerSchema } = require("../validations/auth.validation");
// const rateLimit = require("express-rate-limit");

const router = express.Router();
// const authRateLimit = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 2,
//   message: {
//     success: false,
//     message: "Too many requests, please try again later.",
//   },
// });

router.post(
  "/register",
  // validateRequest(registerSchema),
  authController.register
);
// router.get("/csrf-token", authController.verifyEmail);

router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/user", authController.getProfile);
router.post("/change-password", authController.changePassword);
router.post("/forgot-password", authController.changePassword);
router.post("/send-otp", authController.sendOtp);

module.exports = router;
