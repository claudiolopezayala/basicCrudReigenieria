import { Request, Response } from "express";
import { db } from "../db/connection.db";
import { StatusCodes } from "http-status-codes";
import { eq } from "drizzle-orm";
import { saleItemTable, saleTable } from "../db/schemas/saleSchema";
import { productTable } from "../db/schemas/productSchema";

/**
 * @swagger
 * /sale:
 *   post:
 *     summary: Crear una venta
 *     tags:
 *       - Ventas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - client_id
 *               - employee_id
 *               - total_amount
 *               - status
 *               - items
 *             properties:
 *               client_id:
 *                 type: number
 *                 description: ID del cliente
 *               employee_id:
 *                 type: number
 *                 description: ID del empleado
 *               total_amount:
 *                 type: number
 *                 description: Monto total de la venta
 *               status:
 *                 type: string
 *                 description: Estado de la venta
 *               items:
 *                 type: array
 *                 description: Lista de productos en la venta
 *                 items:
 *                   type: object
 *                   required:
 *                     - product_id
 *                     - price
 *                     - quantity
 *                   properties:
 *                     product_id:
 *                       type: number
 *                       description: ID del producto
 *                     price:
 *                       type: number
 *                       description: Precio del producto
 *                     quantity:
 *                       type: number
 *                       description: Cantidad de productos
 *     responses:
 *       201:
 *         description: Venta creada correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
export const createSale = async (req: Request, res: Response) => {
  const sale: typeof saleTable.$inferInsert & {items:(typeof saleItemTable.$inferInsert)[]} = req.body;
  try {
    const {items, ...saleToInsert} = sale

    const productsIdsArray =  items.map(item => item.product_id)
    const productsIdsSet = new Set(productsIdsArray)

    if(productsIdsArray.length !== productsIdsSet.size){
      res
      .status(StatusCodes.BAD_REQUEST)
      .json({ 
        message: "No se puede crear una venta con un producto repetido",
      });

      return
    }

    const result = await db.transaction(async trx=>{
      const [insertedSale] = await trx
        .insert(saleTable)
        .values(saleToInsert)
        .returning()

      const insertedItems = await Promise.all(items.map(async item=>{
        const [product] = await trx
          .select()
          .from(productTable)
          .where(eq(productTable.id, item.product_id))

        const newStock = (product.stock || 0) - item.quantity

        const [updatedProduct] = await trx
          .update(productTable)
          .set({stock: newStock})
          .where(eq(productTable.id, item.product_id))
          .returning()

        item.sale_id = insertedSale.id

        const [insertedItem] = await trx
          .insert(saleItemTable)
          .values(item)
          .returning()

        return {...insertedItem, product: updatedProduct}
      }))

      return {...insertedSale, items: insertedItems}
    })
  
    res
      .status(StatusCodes.CREATED)
      .json(result);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to create Sale", 
        error: error 
      });
  }
};

/**
 * @swagger
 * /sale:
 *   get:
 *     summary: Obtener todas las ventas
 *     tags:
 *       - Ventas
 *     responses:
 *       200:
 *         description: Lista de ventas obtenida correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
export const getSales = async (req: Request, res: Response) => {
  try {
    const sales = await db
      .select()
      .from(saleTable)

    res
      .status(StatusCodes.OK)
      .json(sales);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to fetch Sales", 
        error:error 
      });
  }
};

/**
 * @swagger
 * /sale/{id}:
 *   get:
 *     summary: Obtener una venta por ID
 *     tags:
 *       - Ventas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID de la venta a consultar.
 *     responses:
 *       200:
 *         description: Venta obtenida correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
export const getSaleById = async (req: Request, res: Response) => {
  try {
    const id = +req.params.id

    const [sale] = await db
      .select()
      .from(saleTable)
      .where(eq(saleTable.id, id))

    const items = await db
      .select()
      .from(saleItemTable)
      .innerJoin(productTable, eq(productTable.id, saleItemTable.product_id))
      .where(eq(saleItemTable.sale_id, sale.id))

    res
      .status(StatusCodes.OK)
      .json({...sale, items});
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to fetch Sale", 
        error:error 
      });
  }
};

/**
 * @swagger
 * /sale:
 *   put:
 *     summary: Actualizar el estado de una venta
 *     tags:
 *       - Ventas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - status
 *             properties:
 *               id:
 *                 type: number
 *                 description: ID de la venta
 *               status:
 *                 type: string
 *                 description: Nuevo estado de la venta
 *     responses:
 *       200:
 *         description: Estado de la venta actualizado correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
export const updateSale = async (req: Request, res: Response) => {
  const sale = req.body;
  try {
    const [updatedSale] = await db
      .update(saleTable)
      .set({status: sale.status})
      .where(eq(saleTable.id, sale.id))
      .returning()

    res
      .status(StatusCodes.OK)
      .json(updatedSale);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to update Sale", 
        error:error 
      });
  }
};

/**
 * @swagger
 * /sale/{id}:
 *   delete:
 *     summary: Eliminar una venta por ID
 *     tags:
 *       - Ventas
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID de la venta a eliminar.
 *     responses:
 *       200:
 *         description: Venta eliminada correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
export const deleteSale = async (req: Request, res: Response) => {
  const id = +req.params.id;
  try {
    await  db
      .delete(saleTable)
      .where(eq(saleTable.id, id))

    res
      .status(StatusCodes.NO_CONTENT)
      .send();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to delete Sale" ,
        error: error
      });
  }
};
