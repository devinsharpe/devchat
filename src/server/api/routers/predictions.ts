import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import Replicate from "replicate";
import { PREDICTION_MODEL } from "~/server/ml";

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
});
