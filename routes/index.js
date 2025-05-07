const express = require("express");
const authRoutes = require("./auth.routes");
const uploadRoutes = require("./upload.routes");
const messageRoutes = require("./message.routes");

const router = express.Router();

router.use("/", authRoutes);
router.use("/", uploadRoutes);
router.use("/", messageRoutes);

module.exports = router;
