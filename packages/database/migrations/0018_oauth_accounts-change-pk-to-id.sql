ALTER TABLE "oauth_accounts" DROP CONSTRAINT "oauth_accounts_providerId_accountId_pk";--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD PRIMARY KEY ("id");