import {
  type AnyPgColumn,
  pgTable,
  smallint,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { idConfig } from "../utils";
import { type InferModel, relations } from "drizzle-orm";

// Conversation
//
// id
// title
// sys message
// prompt count
// created at
// updated at
//
//

const conversations = pgTable("conversations", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  title: varchar("title").notNull(),
  systemMessage: varchar("systemMessage"),
  temperature: smallint("temperature").default(75),
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

// exchange
//
// id
// prompt
// response
// time elapsed
// createdAt
// conversationId

const exchanges = pgTable("exchanges", {
  id: varchar("id", idConfig).primaryKey().notNull(),
  prompt: varchar("prompt").notNull(),
  reponse: varchar("response").notNull(),
  timeElapsed: smallint("timeElapsed").notNull(),
  conversationId: varchar("conversationId", idConfig)
    .notNull()
    .references((): AnyPgColumn => conversations.id),
});
const exchangeRelations = relations(exchanges, ({ one }) => ({
  conversation: one(conversations, {
    fields: [exchanges.conversationId],
    references: [conversations.id],
  }),
}));
export type Exchange = InferModel<typeof exchanges, "select">;
export type NewExchange = InferModel<typeof exchanges, "insert">;

const schema = {
  conversations,
  exchanges,
};
export const relationSchema = {
  conversations: conversationRelations,
  exchanges: exchangeRelations,
};

export default schema;
