import { Router } from "express";
import productRouter from "./product.routes";
import employeeRouter from "./employee.routes";
import clientRouter from "./client.routes";

const router = Router()

router.use("/product", productRouter)
router.use("/employee", employeeRouter)
router.use("/client", clientRouter)

export {router}