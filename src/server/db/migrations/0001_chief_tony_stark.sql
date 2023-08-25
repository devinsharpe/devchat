ALTER TABLE "conversations" ADD COLUMN "temperature" smallint DEFAULT 75;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "maxNewTokens" smallint DEFAULT 500;--> statement-breakpoint
ALTER TABLE "conversations" ADD COLUMN "minNewTokens" smallint DEFAULT -1;