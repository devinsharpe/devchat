import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { conversations, exchanges } from "~/server/db/schema";
import { createId } from "~/server/db/utils";
import { createTRPCRouter, publicProcedure } from "../trpc";

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
      console.log(input);
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
        prompt: `**user** ${input.prompt} **bot** ${res.response}`,
        system_prompt:
          "You are a helpful bot dedicated to summarizing conversations into a simple title that covers both sides of the conversation. Please summarize the provided conversations in 15 words or │ess. The conversations with be provided in the following format: **user** [[query]] **bot** [[response]]",
      });
      await ctx.db.update(conversations).set({
        title: titleRes.response,
      });
      return {
        conversation,
        exchanges: [exchange],
      };
    }),
  get: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
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
        .from(conversations)
        .where(eq(exchanges.conversationId, conversation.id))
        .orderBy(desc(exchanges.createdAt));
      return {
        conversation,
        exchanges: exchangeList,
      };
    }),
});
