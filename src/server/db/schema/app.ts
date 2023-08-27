import { relations, type InferModel } from "drizzle-orm";
import {
  real,
  pgTable,
  smallint,
  timestamp,
  varchar,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { idConfig } from "../utils";

const conversations = pgTable("conversations", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  title: varchar("title").notNull(),
  systemMessage: varchar("systemMessage"),
  temperature: real("temperature").default(0.75),
  maxNewTokens: smallint("maxNewTokens").default(500),
  minNewTokens: smallint("minNewTokens").default(-1),
  promptCount: smallint("promptCount"),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
  updatedAt: timestamp("updatedAt", {
    withTimezone: true,
    mode: "string",
  }),
});
const conversationRelations = relations(conversations, ({ many }) => ({
  exchanges: many(exchanges),
}));
export type Conversation = InferModel<typeof conversations, "select">;
export type NewConversation = InferModel<typeof conversations, "insert">;

const exchanges = pgTable("exchanges", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  prompt: varchar("prompt").notNull(),
  response: varchar("response").notNull(),
  timeElapsed: smallint("timeElapsed").notNull(),
  conversationId: varchar("conversationId", idConfig)
    .notNull()
    .references((): AnyPgColumn => conversations.id),
  createdAt: timestamp("createdAt", {
    withTimezone: true,
    mode: "string",
  }).defaultNow(),
});
const exchangeRelations = relations(exchanges, ({ one }) => ({
  conversation: one(conversations, {
    fields: [exchanges.conversationId],
    references: [conversations.id],
  }),
}));
export type Exchange = InferModel<typeof exchanges, "select">;
export type NewExchange = InferModel<typeof exchanges, "insert">;

export const relationSchema = {
  conversations: conversationRelations,
  exchanges: exchangeRelations,
};

const schema = {
  conversations,
  exchanges,
};

export default schema;
