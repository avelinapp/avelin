ALTER TABLE "oauth_accounts" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "oauth_accounts" ADD COLUMN "deletedAt" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "updatedAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "createdAt" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "deletedAt" timestamp with time zone;