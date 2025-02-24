import { Request, Response } from "express";
import { db } from "../db/connection.db";
import { productTable, inventoryTable } from "../db/schemas/productSchema";
import { StatusCodes } from "http-status-codes";
import { eq } from "drizzle-orm";

/**
 * @swagger
 * /product:
 *   post:
 *     summary: Crear un nuevo producto
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, price, stock]
 *             properties:
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 description: Nombre del producto.
 *               description:
 *                 type: string
 *                 maxLength: 255
 *                 description: Descripción del producto (opcional).
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 description: Precio del producto.
 *               stock:
 *                 type: number
 *                 minimum: 0
 *                 description: Cantidad en stock.
 *     responses:
 *       201:
 *         description: Producto creado correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
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

/**
 * @swagger
 * /product:
 *   get:
 *     summary: Obtener la lista de productos
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos obtenida correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
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

/**
 * @swagger
 * /product:
 *   put:
 *     summary: Actualizar un producto existente
 *     tags:
 *       - Productos
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
 *                 description: ID del producto a actualizar.
 *               name:
 *                 type: string
 *                 maxLength: 150
 *                 description: Nuevo nombre del producto.
 *               description:
 *                 type: string
 *                 maxLength: 255
 *                 description: Nueva descripción del producto.
 *               price:
 *                 type: number
 *                 minimum: 0
 *                 description: Nuevo precio del producto.
 *     responses:
 *       200:
 *         description: Producto actualizado correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
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

/**
 * @swagger
 * /product/{id}:
 *   delete:
 *     summary: Eliminar un producto
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: ID del producto a eliminar.
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
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

/**
 * @swagger
 * /product/inventory:
 *   post:
 *     summary: Actualizar el inventario de un producto
 *     tags:
 *       - Productos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [product_id, quantity]
 *             properties:
 *               product_id:
 *                 type: number
 *                 description: ID del producto.
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *                 description: Cantidad a agregar al inventario.
 *     responses:
 *       200:
 *         description: Inventario actualizado correctamente.
 *       400:
 *         description: Solicitud incorrecta.
 *       401:
 *         description: No autenticado.
 *       403:
 *         description: Usuario sin permiso.
 */
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
