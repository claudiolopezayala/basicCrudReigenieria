import { decimal, pgSchema, serial, text } from "drizzle-orm/pg-core";

export const purchaseSchema = pgSchema("purchase")

export const purchaseTable = purchaseSchema.table("purchase",{
  id: serial("id").primaryKey(),
  description: text("description"),
  price: decimal("price"),
  payment_method: text("payment_method"),
})