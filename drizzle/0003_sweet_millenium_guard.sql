ALTER TABLE "sale"."sale_item" DROP CONSTRAINT "sale_item_sale_id_sale_id_fk";
--> statement-breakpoint
ALTER TABLE "sale"."sale_item" ADD CONSTRAINT "sale_item_sale_id_sale_id_fk" FOREIGN KEY ("sale_id") REFERENCES "sale"."sale"("id") ON DELETE cascade ON UPDATE no action;