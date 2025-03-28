require("dotenv").config();
const nodemailer = require("nodemailer");

console.log(process.env.EMAIL_USER, process.env.EMAIL_PASS);
module.exports.transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
