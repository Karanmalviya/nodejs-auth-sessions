require("dotenv").config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 587,
  secure: false,
  host: process.env.SMTP_HOST,
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendMail(to, subject, html) {
  try {
    const mailOptions = {
      from: `"InfinityOPS"${process.env.SMTP_USER}`,
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
