CREATE TABLE "jwks" (
	"id" text PRIMARY KEY NOT NULL,
	"publicKey" text NOT NULL,
	"privateKey" text NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"deletedAt" timestamp with time zone
);
