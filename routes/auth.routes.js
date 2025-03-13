const express = require("express");
const authController = require("../controllers/auth.controller");
const validateRequest = require("../middlewares/validateRequest");
const { registerSchema } = require("../validations/auth.validation");

const router = express.Router();

router.post(
  "/register",
  // validateRequest(registerSchema),
  authController.register
);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.get("/profile", authController.getProfile);
router.post("/change-password", authController.changePassword);

module.exports = router;
