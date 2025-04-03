const crypto = require('crypto');

function generateOTP(length = 6) {
    const buffer = crypto.randomBytes(length);
    const hex = buffer.toString('hex');
    const otp = parseInt(hex, 16).toString().slice(0, length);
    return otp.padStart(length, '0');
}
module.exports = generateOTP