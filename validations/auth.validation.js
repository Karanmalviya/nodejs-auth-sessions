const Joi = require("joi");

// Joi schema for user registration
const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required.",
    "string.empty": "Name cannot be empty.",
  }),
  email: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email cannot be empty.",
  }),
  password: Joi.string()
    .min(8)
    .required()
    .pattern(/[A-Z]/, "at least one uppercase letter")
    .pattern(/[a-z]/, "at least one lowercase letter")
    .pattern(/[0-9]/, "at least one number")
    .pattern(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      "at least one special character"
    )
    .messages({
      "any.required": "Password is required.",
      "string.min": "Password must be at least 8 characters long.",
      "string.pattern.name": "Password must contain {#name}.",
      "string.empty": "Password cannot be empty.",
    }),
});

// Joi schema for user login
const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "any.required": "Email is required.",
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email cannot be empty.",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required.",
    "string.empty": "Password cannot be empty.",
  }),
});

module.exports = {
  registerSchema,
  userLoginSchema,
};
