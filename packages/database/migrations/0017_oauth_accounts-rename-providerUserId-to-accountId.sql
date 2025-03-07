ALTER TABLE "oauth_accounts" RENAME COLUMN "providerUserId" TO "accountId";--> statement-breakpoint
ALTER TABLE "oauth_accounts" DROP CONSTRAINT "oauth_accounts_providerId_providerUserId_pk";--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_providerId_accountId_pk" PRIMARY KEY("providerId","accountId");