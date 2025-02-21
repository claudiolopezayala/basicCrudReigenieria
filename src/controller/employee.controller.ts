import { Request, Response } from "express";
import { db } from "../db/connection.db";
import { employeeTable } from "../db/schemas/entitySchema";
import { StatusCodes } from "http-status-codes";
import { eq } from "drizzle-orm";

export const createEmployee = async (req: Request, res: Response) => {
  const employee = req.body;
  try {
    const [newEmployee] = await db
      .insert(employeeTable)
      .values(employee)
      .returning();

    res
      .status(StatusCodes.CREATED)
      .json(newEmployee);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to create employee", 
        error: error 
      });
  }
};

export const getEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await db
      .select()
      .from(employeeTable);

    res
      .status(StatusCodes.OK)
      .json(employees);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to fetch employees", 
        error:error 
      });
  }
};

export const updateEmployee = async (req: Request, res: Response) => {
  const employee = req.body;
  try {
    const [oldEmployee] = await db
      .select()
      .from(employeeTable)
      .where(eq(employeeTable.id, employee.id))

    const newEmployee = {...oldEmployee, ...employee}

    const [updatedEmployee] = await db
      .update(employeeTable)
      .set(newEmployee)
      .where(eq(employeeTable.id, employee.id))
      .returning();

    res
      .status(StatusCodes.OK)
      .json(updatedEmployee);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to update employee", 
        error:error 
      });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db
    .delete(employeeTable)
    .where(eq(employeeTable.id, parseInt(id)));

    res
      .status(StatusCodes.NO_CONTENT)
      .send();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to delete employee" ,
        error: error
      });
  }
};
