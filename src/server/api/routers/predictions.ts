import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import Replicate from "replicate";
import { HOME_PROMPTS, PREDICTION_MODEL } from "~/server/ml";

export const predictionsRouter = createTRPCRouter({
  create: publicProcedure
    .input(
      z.object({
        prompt: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const replicate = new Replicate({
        auth: env.REPLICATE_TOKEN,
      });
      const output = await replicate.run(PREDICTION_MODEL, {
        input: {
          prompt: input.prompt,
        },
      });
      return output as string[];
    }),
  homePrediction: publicProcedure
    .input(z.object({ index: z.number().max(4) }))
    .query(async ({ ctx, input }) => {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() - 1);
      const stored = await ctx.kv.get<{
        response: string;
        createdAt: string;
      }>(`prediction:${input.index}`);
      if (stored && new Date(stored.createdAt) > expiryDate)
        return stored.response;
      const res = await ctx.ml.runPrediction({
        prompt: HOME_PROMPTS[input.index] ?? "",
      });
      await ctx.kv.set(`prediction:${input.index}`, {
        response: res.response,
        createdAt: new Date().toISOString(),
      });
      return res.response;
    }),
});
