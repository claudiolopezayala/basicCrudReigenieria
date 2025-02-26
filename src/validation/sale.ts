import { saleTable } from "../db/schemas/saleSchema";
import Joi from "joi";

export const createSaleValidation = Joi.object({
  client_id: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del cliente debe ser un número",
    "number.integer": "El ID del cliente debe ser un número entero",
    "number.positive": "El ID del cliente debe ser un número positivo",
    "any.required": "El ID del cliente es requerido",
  }),
  employee_id: Joi.number().integer().positive().required().messages({
    "number.base": "El ID del empleado debe ser un número",
    "number.integer": "El ID del empleado debe ser un número entero",
    "number.positive": "El ID del empleado debe ser un número positivo",
    "any.required": "El ID del empleado es requerido",
  }),
  total_amount: Joi.number().positive().required().messages({
    "number.base": "El monto total debe ser un número",
    "number.positive": "El monto total debe ser un número positivo",
    "any.required": "El monto total es requerido",
  }),
  status: Joi.string().valid(...saleTable.status.enumValues).required().messages({
    "string.base": "El estado debe ser de tipo texto",
    "any.only": `El estado solo puede ser ${saleTable.status.enumValues}`,
    "any.required": "El estado es requerido",
  }),
  items: Joi.array().items(
    Joi.object({
      product_id: Joi.number().integer().positive().required().messages({
        "number.base": "El ID del producto debe ser un número",
        "number.integer": "El ID del producto debe ser un número entero",
        "number.positive": "El ID del producto debe ser un número positivo",
        "any.required": "El ID del producto es requerido",
      }),
      price: Joi.number().positive().required().messages({
        "number.base": "El precio debe ser un número",
        "number.positive": "El precio debe ser un número positivo",
        "any.required": "El precio es requerido",
      }),
      quantity: Joi.number().integer().positive().required().messages({
        "number.base": "La cantidad debe ser un número",
        "number.integer": "La cantidad debe ser un número entero",
        "number.positive": "La cantidad debe ser un número positivo",
        "any.required": "La cantidad es requerida",
      }),
    })
  ).min(1).required().messages({
    "array.base": "Los artículos deben estar en un arreglo",
    "array.min": "Debe haber al menos un artículo en la orden",
    "any.required": "Los artículos son requeridos",
  }),
});

export const updateSaleValidation = Joi.object({
  id: Joi.number().integer().required().messages({
      "number.base": "The ID must be a number",
      "number.integer": "The ID must be an integer",
      "any.required": "The ID is required",
    }),
  status: Joi.string().valid(...saleTable.status.enumValues).required().messages({
    "string.base": "El estado debe ser de tipo texto",
    "any.only": `El estado solo puede ser ${saleTable.status.enumValues}`,
    "any.required": "El estado es requerido",
  })
});