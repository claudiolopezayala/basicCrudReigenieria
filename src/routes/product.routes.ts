import { Router } from "express";
import { createProduct, getProducts, updateProduct, deleteProduct, updateInventory } from "../controller/product.controller";
import { validationBody, validationParams } from "../middleware/validation";
import { idValidation } from "../validation/common";
import { postInventoryValidation, postProductValidation, putProductValidation } from "../validation/product";

const productRouter = Router();

productRouter.post("/", validationBody(postProductValidation), createProduct);
productRouter.get("/", getProducts);
productRouter.put("/", validationBody(putProductValidation), updateProduct);
productRouter.delete("/:id", validationParams(idValidation), deleteProduct);
productRouter.post("/inventory", validationBody(postInventoryValidation), updateInventory);

export default productRouter;
