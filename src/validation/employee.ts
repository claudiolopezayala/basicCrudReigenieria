import { employeeTable } from "../db/schemas/entitySchema";
import Joi from "joi";

export const postEmployeeValidation = Joi.object({
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
  role: Joi.string().valid(...employeeTable.role.enumValues).required().messages({
    "string.base": "The role must be of type text",
    "any.only": `The role must be one of ${employeeTable.role.enumValues}`,
    "any.required": "The role is required",
  }),
  hire_date: Joi.date().required().messages({
    "date.base": "The hire date must be a valid date",
    "any.required": "The hire date is required",
  }),
});

export const putEmployeeValidation = Joi.object({
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
  role: Joi.string().valid(...employeeTable.role.enumValues).messages({
    "string.base": "The role must be of type text",
    "any.only": `The role must be one of ${employeeTable.role.enumValues}`,
  }),
  hire_date: Joi.date().messages({
    "date.base": "The hire date must be a valid date",
  }),
});
