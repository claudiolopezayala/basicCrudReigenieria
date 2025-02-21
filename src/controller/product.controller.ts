import { Request, Response } from "express";
import { db } from "../db/connection.db";
import { productTable, inventoryTable } from "../db/schemas/productSchema";
import { StatusCodes } from "http-status-codes";
import { eq } from "drizzle-orm";

export const createProduct = async (req: Request, res: Response) => {
  const product = req.body;
  try {
    const [newProduct] = await db
      .insert(productTable)
      .values(product)
      .returning();

    res
      .status(StatusCodes.CREATED)
      .json(newProduct);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to create product", 
        error: error 
      });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await db
      .select()
      .from(productTable);

    res
      .status(StatusCodes.OK)
      .json(products);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to fetch products", 
        error:error 
      });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = req.body;
  try {
    const [oldProduct] = await db
      .select()
      .from(productTable)
      .where(eq(productTable.id, product.id))

    const newProduct = {...oldProduct, ...product}

    const [updatedProduct] = await db
      .update(productTable)
      .set(newProduct)
      .where(eq(productTable.id, product.id))
      .returning();

    res
      .status(StatusCodes.OK)
      .json(updatedProduct);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to update product", 
        error:error 
      });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db
    .delete(productTable)
    .where(eq(productTable.id, parseInt(id)));

    res
      .status(StatusCodes.NO_CONTENT)
      .send();
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to delete product" ,
        error: error
      });
  }
};

export const updateInventory = async (req: Request, res: Response) => {
  const { product_id, quantity } = req.body;
  try {
    const [newInventory] = await db
      .insert(inventoryTable)
      .values({ product_id, quantity })
      .returning();

    const [product] = await db
      .select()
      .from(productTable)
      .where(eq(productTable.id, product_id))

    const updatedStock = product.stock + quantity;

    await db
      .update(productTable)
      .set({ stock: updatedStock })
      .where(eq(productTable.id, product_id));

    res
      .status(StatusCodes.OK)
      .json(newInventory);
  } catch (error) {
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ 
        message: "Failed to update inventory", 
        error: error 
      });
  }
};
