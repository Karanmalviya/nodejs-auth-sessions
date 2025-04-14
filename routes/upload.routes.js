const express = require("express");
const { uploadController } = require("../controllers/upload.controller");
const uploads = require("../middlewares/upload.middleware");

const router = express.Router();

router.post("/upload", uploads.single("file"), uploadController);

module.exports = router;
