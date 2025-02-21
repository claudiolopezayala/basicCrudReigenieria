import { decimal, integer, pgSchema, serial, text, timestamp } from "drizzle-orm/pg-core";

export const productSchema = pgSchema("product")

export const productTable = productSchema.table("product",{
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price").notNull(),
  stock: integer("stock").default(0),
  created_at: timestamp("created_at").defaultNow(),
})

export const inventoryTable = productSchema.table("inventory",{
  id: serial("id").primaryKey(),
  product_id: integer("product_id").notNull().references(()=>productTable.id,{onDelete:"cascade"}),
  quantity: integer("quantity").notNull(),
  time: timestamp("time").defaultNow(),
})