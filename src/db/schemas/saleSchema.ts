import { decimal, integer, pgSchema, serial, timestamp } from "drizzle-orm/pg-core";
import { clientTable, employeeTable } from "./entitySchema";
import { productTable } from "./productSchema";

export const saleSchema = pgSchema("sale")

export const saleStatusEnum = saleSchema.enum("sale_status",[
  "Pending",
  "Completed",
  "Canceled"
])

export const saleTable = saleSchema.table("sale",{
  id: serial("id").primaryKey(),
  client_id: integer("client_id").notNull().references(()=> clientTable.id,{onDelete: "no action"}),
  employee_id: integer("employee_id").notNull().references(()=> employeeTable.id,{onDelete:"no action"}),
  total_amount: decimal("total_amount").notNull(),
  status: saleStatusEnum("status").default("Pending"),
  sale_date: timestamp("sale_date").defaultNow()
})

export const saleItemTable = saleSchema.table("sale_item",{
  id: serial("id").primaryKey(),
  sale_id: integer("sale_id").notNull().references(()=>saleTable.id),
  product_id: integer("product_id").notNull().references(()=>productTable.id),
  quantity: integer("quantity").notNull(),
  price: decimal("price").notNull()
})