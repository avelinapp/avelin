DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pg_uuidv7') THEN
    CREATE EXTENSION "pg_uuidv7";
  END IF;
END;
$$; --> statement-breakpoint

-- Add the new 'id' column (initially nullable)
ALTER TABLE "oauth_accounts" ADD COLUMN "id" TEXT; --> statement-breakpoint

-- Populate the 'id' column with custom IDs
UPDATE "oauth_accounts" SET id = 'account_' || REPLACE(uuid_generate_v7()::TEXT, '-', ''); --> statement-breakpoint

-- Make the 'id' column non-nullable
ALTER TABLE "oauth_accounts" ALTER COLUMN "id" SET NOT NULL; --> statement-breakpoint

-- Add additional columns
ALTER TABLE "oauth_accounts" ADD COLUMN "accessToken" text;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD COLUMN "refreshToken" text;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD COLUMN "idToken" text;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD COLUMN "accessTokenExpiresAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD COLUMN "refreshTokenExpiresAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD COLUMN "scope" text;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD COLUMN "password" text;
