import { createSale, deleteSale, getSaleById, getSales, updateSale } from "../controller/sale.controller";
import { Router } from "express";

const saleRouter = Router()

saleRouter.post("/", createSale);
saleRouter.get("/", getSales);
saleRouter.get("/:id", getSaleById);
saleRouter.put("/", updateSale);
saleRouter.delete("/:id", deleteSale);

export {saleRouter}