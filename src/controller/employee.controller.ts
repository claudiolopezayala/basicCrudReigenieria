import { Request, Response } from "express";
import { db } from "../db/connection.db";
import { employeeTable } from "../db/schemas/entitySchema";
import { StatusCodes } from "http-status-codes";
import { eq } from "drizzle-orm";

/**
 * @swagger
 * /employee:
 *   post:
 *     summary: Crear un nuevo empleado
 *     tags:
 *       - Empleados
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, role, hire_date]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 description: Nombre del empleado.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del empleado.
 *               phone:
 *                 type: string
 *                 description: Número de teléfono del empleado (opcional).
 *               role:
 *                 type: string
 *                 enum: ["manager", "cashier", "stock_keeper", "sales_rep"]
 *                 description: Rol del empleado en la empresa.
 *               hire_date:
 *                 type: string
 *                 format: date
 *                 description: Fecha de contratación del empleado.
 *     responses:
 *       201:
 *         description: Empleado creado correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
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

/**
 * @swagger
 * /employee:
 *   get:
 *     summary: Obtener la lista de empleados
 *     tags:
 *       - Empleados
 *     responses:
 *       200:
 *         description: Lista de empleados obtenida correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
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

/**
 * @swagger
 * /employee:
 *   put:
 *     summary: Actualizar un empleado existente
 *     tags:
 *       - Empleados
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id]
 *             properties:
 *               id:
 *                 type: number
 *                 description: ID del empleado a actualizar.
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 description: Nuevo nombre del empleado.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo correo electrónico del empleado.
 *               phone:
 *                 type: string
 *                 description: Nuevo número de teléfono del empleado.
 *               role:
 *                 type: string
 *                 enum: ["manager", "cashier", "stock_keeper", "sales_rep"]
 *                 description: Nuevo rol del empleado en la empresa.
 *               hire_date:
 *                 type: string
 *                 format: date
 *                 description: Nueva fecha de contratación del empleado.
 *     responses:
 *       200:
 *         description: Empleado actualizado correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
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

/**
 * @swagger
 * /employee/{id}:
 *   delete:
 *     summary: Eliminar un empleado
 *     tags:
 *       - Empleados
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del empleado a eliminar.
 *     responses:
 *       200:
 *         description: Empleado eliminado correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
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
