import { Router } from "express";
import { createProduct, getProducts, updateProduct, deleteProduct, updateInventory } from "../controller/product.controller";

const productRouter = Router();

productRouter.post("/", createProduct);
productRouter.get("/", getProducts);
productRouter.put("/", updateProduct);
productRouter.delete("/:id", deleteProduct);
productRouter.post("/inventory", updateInventory);

export default productRouter;
