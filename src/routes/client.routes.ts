import { Router } from "express";
import { createClient, getClients, updateClient, deleteClient } from "../controller/client.controller";
import { validationBody, validationParams } from "../middleware/validation";
import { idValidation } from "../validation/common";
import { postClientValidation, putClientValidation } from "../validation/client";

const clientRouter = Router();

clientRouter.post("/", validationBody(postClientValidation), createClient);
clientRouter.get("/", getClients);
clientRouter.put("/", validationBody(putClientValidation), updateClient);
clientRouter.delete("/:id", validationParams(idValidation), deleteClient);

export default clientRouter;
