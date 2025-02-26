import { validationBody, validationParams } from "../middleware/validation";
import { createSale, deleteSale, getSaleById, getSales, updateSale } from "../controller/sale.controller";
import { Router } from "express";
import { createSaleValidation, updateSaleValidation } from "../validation/sale";
import { idValidation } from "../validation/common";

const saleRouter = Router()

saleRouter.post("/", validationBody(createSaleValidation), createSale);
saleRouter.get("/", getSales);
saleRouter.get("/:id", validationParams(idValidation), getSaleById);
saleRouter.put("/", validationBody(updateSaleValidation), updateSale);
saleRouter.delete("/:id", validationParams(idValidation), deleteSale);

export {saleRouter}