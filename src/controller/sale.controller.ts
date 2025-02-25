import { Request, Response } from "express";
import { db } from "../db/connection.db";
import { StatusCodes } from "http-status-codes";
import { eq } from "drizzle-orm";
import { saleItemTable, saleTable } from "../db/schemas/saleSchema";
import { productTable } from "../db/schemas/productSchema";

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

export const updateSale = async (req: Request, res: Response) => {
  const Sale = req.body;
  try {
    res
      .status(StatusCodes.OK)
      .json();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to update Sale", 
        error:error 
      });
  }
};

export const deleteSale = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {

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
