ALTER TABLE "oauth_accounts" RENAME TO "accounts";--> statement-breakpoint
ALTER TABLE "accounts" DROP CONSTRAINT "oauth_accounts_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;