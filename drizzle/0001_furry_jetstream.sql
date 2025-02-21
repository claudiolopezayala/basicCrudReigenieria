CREATE SCHEMA "entity";
--> statement-breakpoint
CREATE SCHEMA "product";
--> statement-breakpoint
CREATE SCHEMA "sale";
--> statement-breakpoint
CREATE TYPE "entity"."employee_role" AS ENUM('manager', 'cashier', 'stock_keeper', 'sales_rep');--> statement-breakpoint
CREATE TYPE "sale"."sale_status" AS ENUM('Pending', 'Completed', 'Canceled');--> statement-breakpoint
CREATE TABLE "entity"."client" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"address" text,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "client_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "entity"."employee" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"phone" text,
	"role" "entity"."employee_role",
	"hire_date" date NOT NULL,
	CONSTRAINT "employee_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "product"."inventory" (
	"id" serial PRIMARY KEY NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"time" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "product"."product" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"price" numeric NOT NULL,
	"stock" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "sale"."sale_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"sale_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"price" numeric NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sale"."sale" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"employee_id" integer NOT NULL,
	"total_amount" numeric NOT NULL,
	"status" "sale"."sale_status" DEFAULT 'Pending',
	"sale_date" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "product"."inventory" ADD CONSTRAINT "inventory_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale"."sale_item" ADD CONSTRAINT "sale_item_sale_id_sale_id_fk" FOREIGN KEY ("sale_id") REFERENCES "sale"."sale"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale"."sale_item" ADD CONSTRAINT "sale_item_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "product"."product"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale"."sale" ADD CONSTRAINT "sale_client_id_client_id_fk" FOREIGN KEY ("client_id") REFERENCES "entity"."client"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sale"."sale" ADD CONSTRAINT "sale_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "entity"."employee"("id") ON DELETE no action ON UPDATE no action;