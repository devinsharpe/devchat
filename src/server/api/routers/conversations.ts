import { TRPCError } from "@trpc/server";
import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { conversations, exchanges } from "~/server/db/schema";
import { createId } from "~/server/db/utils";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { type Exchange } from "~/server/db/schema/app";
import {
  TITLE_SUMMARY_SYS_PROMPT,
  buildPromptHistory,
  convertConversationToPromptInput,
} from "~/server/ml";

export const conversationsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
        system_prompt: z.string().default(""),
        temperature: z.number().default(0.75),
        max_new_tokens: z.number().default(500),
        min_new_tokens: z.number().default(-1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.db
        .insert(conversations)
        .values({
          id: createId(),
          title: "",
          promptCount: 1,
          systemMessage: input.system_prompt,
          temperature: input.temperature,
          maxNewTokens: input.max_new_tokens,
          minNewTokens: input.min_new_tokens,
        })
        .returning()
        .then((conv) => conv[0]!);
      const res = await ctx.ml.runPrediction(input);
      const exchange = await ctx.db.insert(exchanges).values({
        id: createId(),
        prompt: input.prompt,
        response: res.response,
        timeElapsed: res.timeElapsed,
        conversationId: conversation.id,
      });
      const titleRes = await ctx.ml.runPrediction({
        prompt: `
        --- ${conversation.id} ---
        [[user]] ${input.prompt}
        [[bot]] ${res.response}
        `,
        system_prompt: TITLE_SUMMARY_SYS_PROMPT,
      });
      await ctx.db
        .update(conversations)
        .set({
          title: titleRes.response,
        })
        .where(eq(conversations.id, conversation.id));
      return {
        conversation,
        exchanges: [exchange],
      };
    }),
  exchange: publicProcedure
    .input(
      z.object({
        id: z.string(),
        prompt: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const conversation = await ctx.db
        .select()
        .from(conversations)
        .where(eq(conversations.id, input.id))
        .then((conv) => conv[0] ?? null);
      if (!conversation)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Message not found",
        });
      const exchangeList = await ctx.db
        .select()
        .from(exchanges)
        .where(eq(exchanges.conversationId, conversation.id))
        .orderBy(asc(exchanges.createdAt));
      const res = await ctx.ml.runPrediction({
        ...convertConversationToPromptInput(conversation),
        prompt: buildPromptHistory(exchangeList, input.prompt),
      });
      const exchange = await ctx.db
        .insert(exchanges)
        .values({
          id: createId(),
          prompt: input.prompt,
          response: res.response,
          timeElapsed: res.timeElapsed,
          conversationId: conversation.id,
        })
        .returning()
        .then((exchange) => exchange[0] ?? null);
      await ctx.db.update(conversations).set({
        promptCount: conversation.promptCount ?? 0 + 1,
      });
      return exchange;
    }),
  get: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      if (!input.id)
        return {
          conversation: null,
          exchanges: [] as Exchange[],
        };
      const conversation = await ctx.db
        .select()
        .from(conversations)
        .where(eq(conversations.id, input.id))
        .then((conv) => conv[0] ?? null);
      if (!conversation)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Conversation not found",
        });
      const exchangeList = await ctx.db
        .select()
        .from(exchanges)
        .where(eq(exchanges.conversationId, conversation.id))
        .orderBy(asc(exchanges.createdAt));
      return {
        conversation,
        exchanges: exchangeList,
      };
    }),
});
