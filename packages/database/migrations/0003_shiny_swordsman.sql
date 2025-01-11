ALTER TABLE "users" ADD COLUMN "retiredAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "linkedUserId" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "updatedAt" timestamp;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "deletedAt" timestamp;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_linkedUserId_users_id_fk" FOREIGN KEY ("linkedUserId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
