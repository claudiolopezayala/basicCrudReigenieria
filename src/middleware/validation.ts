import Joi from "joi";
import { NextFunction, Response, Request } from "express";
import { StatusCodes } from "http-status-codes";

export const validationBody = <T>(
  schema: Joi.ObjectSchema<T> | Joi.ArraySchema<T>,
) => {
  const joiValidation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const { details } = error;
      const errorMessage = details.map((err) => err.message).join(", ");
      res
        .status(StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS)
        .json(errorMessage)
    } else {
      next();
    }
  };
  return joiValidation;
};

export const validationQueryParams = <T>(schema: Joi.ObjectSchema<T>) => {
  const joiValidation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { error } = schema.validate(req.query, { abortEarly: false });
    if (error) {
      const { details } = error;
      const errorMessage = details.map((err) => err.message).join(", ");
      res
        .status(StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS)
        .json(errorMessage)
    } else {
      next();
    }
  };
  return joiValidation;
};

export const validationParams = <T>(schema: Joi.ObjectSchema<T>) => {
  const joiValidation = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const { error } = schema.validate(req.params, { abortEarly: false });
    if (error) {
      const { details } = error;
      const errorMessage = details.map((err) => err.message).join(", ");
      res
        .status(StatusCodes.UNAVAILABLE_FOR_LEGAL_REASONS)
        .json(errorMessage)
    } else {
      next();
    }
  };
  return joiValidation;
};
