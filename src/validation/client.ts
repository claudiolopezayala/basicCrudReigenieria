import Joi from "joi";

export const postClientValidation = Joi.object({
  name: Joi.string().max(150).required().messages({
    "string.base": "The name must be of type text",
    "string.empty": "The name cannot be empty",
    "any.required": "The name is required",
    "string.max": "The name must have a maximum of 150 characters",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "The email must be of type text",
    "string.email": "The email must be a valid email",
    "any.required": "The email is required",
  }),
  phone: Joi.string().optional().messages({
    "string.base": "The phone must be of type text",
  }),
  address: Joi.string().optional().messages({
    "string.base": "The address must be of type text",
  }),
});

export const putClientValidation = Joi.object({
  id: Joi.number().integer().required().messages({
    "number.base": "The ID must be a number",
    "number.integer": "The ID must be an integer",
    "any.required": "The ID is required",
  }),
  name: Joi.string().max(150).messages({
    "string.base": "The name must be of type text",
    "string.empty": "The name cannot be empty",
    "string.max": "The name must have a maximum of 150 characters",
  }),
  email: Joi.string().email().messages({
    "string.base": "The email must be of type text",
    "string.email": "The email must be a valid email",
  }),
  phone: Joi.string().optional().messages({
    "string.base": "The phone must be of type text",
  }),
  address: Joi.string().optional().messages({
    "string.base": "The address must be of type text",
  }),
});
