const express = require("express");
const authRoutes = require("./auth.routes");
const uploadRoutes = require("./upload.routes");

const router = express.Router();

router.use("/", authRoutes);
router.use("/", uploadRoutes);

module.exports = router;
