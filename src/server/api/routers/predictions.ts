import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "~/env.mjs";
import Replicate from "replicate";

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
      const output = await replicate.run(
        `a16z-infra/llama-2-13b-chat:${env.LLAMA_VERSION_ID}`,
        {
          input: {
            prompt: input.prompt,
          },
        }
      );
      return output as string[];
    }),
});