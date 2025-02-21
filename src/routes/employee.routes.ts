import { Router } from "express";
import { createEmployee, getEmployees, updateEmployee, deleteEmployee } from "../controller/employee.controller";
import { validationBody, validationParams } from "../middleware/validation";
import { idValidation } from "../validation/common";
import { postEmployeeValidation, putEmployeeValidation } from "../validation/employee";

const employeeRouter = Router();

employeeRouter.post("/", validationBody(postEmployeeValidation), createEmployee);
employeeRouter.get("/", getEmployees);
employeeRouter.put("/", validationBody(putEmployeeValidation), updateEmployee);
employeeRouter.delete("/:id", validationParams(idValidation), deleteEmployee);

export default employeeRouter;
