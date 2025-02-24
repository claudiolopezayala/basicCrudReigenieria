import { RequestHandler, Router } from "express";
import productRouter from "./product.routes";
import employeeRouter from "./employee.routes";
import clientRouter from "./client.routes";
import purchaseRouter from "./purchase.routes";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";
import { swaggerOptions } from "../swagger/config.swagger";

const swaggerDoc = swaggerJSDoc(swaggerOptions);

const router = Router()

router.use("/product", productRouter)
router.use("/employee", employeeRouter)
router.use("/client", clientRouter)
router.use("/purchase", purchaseRouter)

router.use(
  "/",
  swaggerUI.serve as unknown as RequestHandler,
  swaggerUI.setup(swaggerDoc) as unknown as RequestHandler,
);

export {router}