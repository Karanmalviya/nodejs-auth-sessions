require("dotenv").config();
const nodemailer = require("nodemailer");
const constants = require("../../constants");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 587,
  secure: false,
  host: constants.SMTP_HOST,
  requireTLS: true,
  auth: {
    user: constants.SMTP_USER,
    pass: constants.SMTP_PASSWORD,
  },
});

async function sendMail(to, subject, html) {
  try {
    const mailOptions = {
      from: `"InfinityOPS"${constants.SMTP_USER}`,
      to,
      subject,
      html,
    };
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = {sendMail};
