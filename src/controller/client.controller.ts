import { Request, Response } from "express";
import { db } from "../db/connection.db";
import { clientTable } from "../db/schemas/entitySchema";
import { StatusCodes } from "http-status-codes";
import { eq } from "drizzle-orm";

/**
 * @swagger
 * /client:
 *   post:
 *     summary: Crear un nuevo cliente
 *     tags:
 *       - Clientes
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 description: Nombre del cliente.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Correo electrónico del cliente.
 *               phone:
 *                 type: string
 *                 description: Número de teléfono del cliente (opcional).
 *               address:
 *                 type: string
 *                 description: Dirección del cliente (opcional).
 *     responses:
 *       201:
 *         description: Cliente creado correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
export const createClient = async (req: Request, res: Response) => {
  const client = req.body;
  try {
    const [newClient] = await db
      .insert(clientTable)
      .values(client)
      .returning();

    res
      .status(StatusCodes.CREATED)
      .json(newClient);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to create client", 
        error: error 
      });
  }
};

/**
 * @swagger
 * /client:
 *   get:
 *     summary: Obtener la lista de clientes
 *     tags:
 *       - Clientes
 *     responses:
 *       200:
 *         description: Lista de clientes obtenida correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
export const getClients = async (req: Request, res: Response) => {
  try {
    const clients = await db
      .select()
      .from(clientTable);

    res
      .status(StatusCodes.OK)
      .json(clients);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to fetch clients", 
        error:error 
      });
  }
};

/**
 * @swagger
 * /client:
 *   put:
 *     summary: Actualizar un cliente existente
 *     tags:
 *       - Clientes
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
 *                 description: ID del cliente a actualizar.
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 description: Nuevo nombre del cliente.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo correo electrónico del cliente.
 *               phone:
 *                 type: string
 *                 description: Nuevo número de teléfono del cliente.
 *               address:
 *                 type: string
 *                 description: Nueva dirección del cliente.
 *     responses:
 *       200:
 *         description: Cliente actualizado correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
export const updateClient = async (req: Request, res: Response) => {
  const client = req.body;
  try {
    const [oldClient] = await db
      .select()
      .from(clientTable)
      .where(eq(clientTable.id, client.id))

    const newClient = {...oldClient, ...client}

    const [updatedClient] = await db
      .update(clientTable)
      .set(newClient)
      .where(eq(clientTable.id, client.id))
      .returning();

    res
      .status(StatusCodes.OK)
      .json(updatedClient);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to update client", 
        error:error 
      });
  }
};

/**
 * @swagger
 * /client/{id}:
 *   delete:
 *     summary: Eliminar un cliente
 *     tags:
 *       - Clientes
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del cliente a eliminar.
 *     responses:
 *       200:
 *         description: Cliente eliminado correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
export const deleteClient = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db
    .delete(clientTable)
    .where(eq(clientTable.id, parseInt(id)));

    res
      .status(StatusCodes.NO_CONTENT)
      .send();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to delete client" ,
        error: error
      });
  }
};
