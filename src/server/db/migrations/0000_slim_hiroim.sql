CREATE TABLE IF NOT EXISTS "conversations" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"systemMessage" varchar,
	"promptCount" smallint,
	"createdAt" timestamp with time zone DEFAULT now(),
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "exchanges" (
	"id" varchar(25) PRIMARY KEY NOT NULL,
	"prompt" varchar NOT NULL,
	"response" varchar NOT NULL,
	"timeElapsed" smallint NOT NULL,
	"conversationId" varchar(25) NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "exchanges" ADD CONSTRAINT "exchanges_conversationId_conversations_id_fk" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
