import { Router } from "express";
import { createPurchase, getPurchases, updatePurchase, deletePurchase } from "../controller/purchase.controller";
import { validationBody, validationParams } from "../middleware/validation";
import { idValidation } from "../validation/common";
import { postPurchaseValidation, putPurchaseValidation } from "../validation/purchase";

const purchaseRouter = Router();

purchaseRouter.post("/", validationBody(postPurchaseValidation), createPurchase);
purchaseRouter.get("/", getPurchases);
purchaseRouter.put("/", validationBody(putPurchaseValidation), updatePurchase);
purchaseRouter.delete("/:id", validationParams(idValidation), deletePurchase);

export default purchaseRouter;
