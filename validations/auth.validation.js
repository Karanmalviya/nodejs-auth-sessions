// const Joi = require("joi");

// // Joi schema for user registration
// const registerSchema = Joi.object({
//   name: Joi.string().required().messages({
//     "any.required": "Name is required.",
//     "string.empty": "Name cannot be empty.",
//   }),
//   email: Joi.string().email().required().messages({
//     "any.required": "Email is required.",
//     "string.email": "Please provide a valid email address.",
//     "string.empty": "Email cannot be empty.",
//   }),
//   password: Joi.string()
//     .min(8)
//     .required()
//     .pattern(/[A-Z]/, "at least one uppercase letter")
//     .pattern(/[a-z]/, "at least one lowercase letter")
//     .pattern(/[0-9]/, "at least one number")
//     .pattern(
//       /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
//       "at least one special character"
//     )
//     .messages({
//       "any.required": "Password is required.",
//       "string.min": "Password must be at least 8 characters long.",
//       "string.pattern.name": "Password must contain {#name}.",
//       "string.empty": "Password cannot be empty.",
//     }),
// });

// // Joi schema for user login
// const userLoginSchema = Joi.object({
//   email: Joi.string().email().required().messages({
//     "any.required": "Email is required.",
//     "string.email": "Please provide a valid email address.",
//     "string.empty": "Email cannot be empty.",
//   }),
//   password: Joi.string().required().messages({
//     "any.required": "Password is required.",
//     "string.empty": "Password cannot be empty.",
//   }),
// });

// module.exports = {
//   registerSchema,
//   userLoginSchema,
// };

const { body } = require("express-validator");

// Validation rules for user registration
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

// Validation rules for user login
const loginValidation = [
  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty.")
    .isEmail()
    .withMessage("Please provide a valid email address."),

  body("password").notEmpty().withMessage("Password cannot be empty."),
];

module.exports = {
  registerValidation,
  loginValidation,
};
