const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const saltRounds = 12;

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    previousPasswords: [{ type: String }],
    failedLoginAttempts: { type: Number, default: 0 },
    blockUntil: { type: Date, default: null },
    passwordExpiry: {
      type: Date,
      default: Date.now() + 90 * 24 * 60 * 60 * 1000,
    },
    refreshToken: { type: String, default: null },
    accessToken: { type: String, default: null },
    otp: { type: Number, default: null },
    otpExpiry: { type: Date, default: null },
    image: {
      name: { type: String, default: null },
      url: { type: String, default: null },
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const hashedPassword = await bcrypt.hash(this.password, saltRounds);
    this.previousPasswords.push(hashedPassword);
    if (this.previousPasswords.length > 5) {
      this.previousPasswords.shift();
    }
    this.password = hashedPassword;
  }
  next();
});
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
