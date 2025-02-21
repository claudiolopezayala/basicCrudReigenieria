import Joi from "joi";

export const postProductValidation = Joi.object({
  name: Joi.string().max(150).required().messages({
    "string.base": "The name must be of type text",
    "string.empty": "The name cannot be empty",
    "any.required": "The name is required",
    "string.max": "The name must have a maximum of 150 characters",
  }),
  description: Joi.string().max(255).allow("").optional().messages({
    "string.base": "The description must be of type text",
    "string.max": "The description must have a maximum of 255 characters",
  }),
  price: Joi.number().positive().required().messages({
    "number.base": "The price must be a number",
    "number.positive": "The price must be a positive number",
    "any.required": "The price is required",
  }),
  stock: Joi.number().integer().min(0).required().messages({
    "number.base": "The stock must be an integer",
    "number.integer": "The stock must be an integer",
    "number.min": "The stock cannot be negative",
    "any.required": "The stock is required",
  }),
});

export const putProductValidation = Joi.object({
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
  description: Joi.string().max(255).allow("").optional().messages({
    "string.base": "The description must be of type text",
    "string.max": "The description must have a maximum of 255 characters",
  }),
  price: Joi.number().positive().messages({
    "number.base": "The price must be a number",
    "number.positive": "The price must be a positive number",
  })
});

export const postInventoryValidation = Joi.object({
  product_id: Joi.number().integer().positive().required().messages({
    "number.base": "The product ID must be a number",
    "number.integer": "The product ID must be an integer",
    "number.positive": "The product ID must be a positive number",
    "any.required": "The product ID is required",
  }),
  quantity: Joi.number().integer().min(1).required().messages({
    "number.base": "The quantity must be a number",
    "number.integer": "The quantity must be an integer",
    "number.min": "The quantity must be at least 1",
    "any.required": "The quantity is required",
  }),
});
