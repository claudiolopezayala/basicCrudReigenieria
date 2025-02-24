import { Request, Response } from "express";
import { db } from "../db/connection.db";
import { purchaseTable } from "../db/schemas/purchaseSchema";
import { StatusCodes } from "http-status-codes";
import { eq } from "drizzle-orm";

/**
 * @swagger
 * /purchase:
 *   post:
 *     summary: Crear una nueva compra
 *     tags:
 *       - Compras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [description, price, payment_method]
 *             properties:
 *               description:
 *                 type: string
 *                 maxLength: 255
 *                 description: Descripción de la compra.
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Precio de la compra.
 *               payment_method:
 *                 type: string
 *                 description: Método de pago utilizado.
 *     responses:
 *       201:
 *         description: Compra creada correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
export const createPurchase = async (req: Request, res: Response) => {
  const purchase = req.body;
  try {
    const [newPurchase] = await db
      .insert(purchaseTable)
      .values(purchase)
      .returning();

    res
      .status(StatusCodes.CREATED)
      .json(newPurchase);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to create purchase", 
        error: error 
      });
  }
};

/**
 * @swagger
 * /purchase:
 *   get:
 *     summary: Obtener la lista de compras
 *     tags:
 *       - Compras
 *     responses:
 *       200:
 *         description: Lista de compras obtenida correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
export const getPurchases = async (req: Request, res: Response) => {
  try {
    const purchases = await db
      .select()
      .from(purchaseTable);

    res
      .status(StatusCodes.OK)
      .json(purchases);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to fetch purchases", 
        error:error 
      });
  }
};

/**
 * @swagger
 * /purchase:
 *   put:
 *     summary: Actualizar una compra existente
 *     tags:
 *       - Compras
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
 *                 description: ID de la compra a actualizar.
 *               description:
 *                 type: string
 *                 maxLength: 255
 *                 description: Nueva descripción de la compra.
 *               price:
 *                 type: number
 *                 format: float
 *                 description: Nuevo precio de la compra.
 *               payment_method:
 *                 type: string
 *                 description: Nuevo método de pago utilizado.
 *     responses:
 *       200:
 *         description: Compra actualizada correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
export const updatePurchase = async (req: Request, res: Response) => {
  const purchase = req.body;
  try {
    const [oldPurchase] = await db
      .select()
      .from(purchaseTable)
      .where(eq(purchaseTable.id, purchase.id))

    const newPurchase = {...oldPurchase, ...purchase}

    const [updatedPurchase] = await db
      .update(purchaseTable)
      .set(newPurchase)
      .where(eq(purchaseTable.id, purchase.id))
      .returning();

    res
      .status(StatusCodes.OK)
      .json(updatedPurchase);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to update purchase", 
        error:error 
      });
  }
};

/**
 * @swagger
 * /purchase/{id}:
 *   delete:
 *     summary: Eliminar una compra
 *     tags:
 *       - Compras
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID de la compra a eliminar.
 *     responses:
 *       200:
 *         description: Compra eliminada correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
export const deletePurchase = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db
    .delete(purchaseTable)
    .where(eq(purchaseTable.id, parseInt(id)));

    res
      .status(StatusCodes.NO_CONTENT)
      .send();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to delete purchase" ,
        error: error
      });
  }
};
