ALTER TABLE "users" DROP CONSTRAINT "users_linkedUserId_users_id_fk";--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "emailVerified" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "linkedUserId";
