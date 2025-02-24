import Joi from "joi";

export const postPurchaseValidation = Joi.object({
  description: Joi.string().max(255).required().messages({
    "string.base": "The description must be of type text",
    "string.empty": "The description cannot be empty",
    "any.required": "The description is required",
    "string.max": "The description must have a maximum of 255 characters",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "The price must be a number",
    "number.positive": "The price must be a positive number",
    "any.required": "The price is required",
  }),
  payment_method: Joi.string().required().messages({
    "string.base": "The payment method must be of type text",
    "any.required": "The payment method is required",
  }),
});

export const putPurchaseValidation = Joi.object({
  id: Joi.number().integer().required().messages({
    "number.base": "The ID must be a number",
    "number.integer": "The ID must be an integer",
    "any.required": "The ID is required",
  }),
  description: Joi.string().max(255).messages({
    "string.base": "The description must be of type text",
    "string.empty": "The description cannot be empty",
    "string.max": "The description must have a maximum of 255 characters",
  }),
  price: Joi.number().positive().messages({
    "number.base": "The price must be a number",
    "number.positive": "The price must be a positive number",
  }),
  payment_method: Joi.string().messages({
    "string.base": "The payment method must be of type text",
  }),
});
