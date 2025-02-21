import { Router } from "express";
import productRouter from "./product.routes";
import employeeRouter from "./employee.routes";

const router = Router()

router.use("/product", productRouter)
router.use("/employee", employeeRouter)

export {router}