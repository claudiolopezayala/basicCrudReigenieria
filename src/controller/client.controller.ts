import { Request, Response } from "express";
import { db } from "../db/connection.db";
import { clientTable } from "../db/schemas/entitySchema";
import { StatusCodes } from "http-status-codes";
import { eq } from "drizzle-orm";

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
