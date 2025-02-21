import Joi from "joi";

export const idValidation = Joi.object({
  id: Joi.number().messages({
    "number.base": "El id debe ser de tipo numero",
    "number.empty": "El id no puede estar vacío",
  }),
});