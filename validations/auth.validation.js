const { body } = require("express-validator");

const registerValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name cannot be empty.")
    .isString()
    .withMessage("Name must be a string."),

  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Please provide a valid email address."),

  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty.")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage("Password must contain at least one special character."),
];

const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Please provide a valid email address."),

  body("password").notEmpty().withMessage("Password cannot be empty."),
];

const forgotPasswordValidation = [
  body("otp")
    .notEmpty()
    .withMessage("Otp is required.")
    .isNumeric()
    .withMessage("Otp must be a number.")
    .isLength({ min: 6, max: 6 })
    .withMessage("Otp must be 6 digits long."),

  body("email")
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please provide a valid email address."),

  body("newPassword")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 8, max: 20 })
    .withMessage("Password must be at least 8 characters long.")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter.")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter.")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number.")
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)
    .withMessage("Password must contain at least one special character."),
];

module.exports = {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
};
