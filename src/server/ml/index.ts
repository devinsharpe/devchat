import { env } from "~/env.mjs";
import Replicate from "replicate";
import type { Conversation, Exchange } from "../db/schema/app";

type MODEL = "`${string}/${string}:${string}`";
export const PREDICTION_MODEL =
  `a16z-infra/llama-2-13b-chat:${env.LLAMA_VERSION_ID}` as MODEL;

export const TITLE_SUMMARY_SYS_PROMPT = `
  You are a helpful bot dedicated to summarizing conversations.

  Summaries should cover both participants and not include any indcicators of speakers.
  Summaries need to be 10 words or less.
  User queries and bot responses may be multiline

  The conversations with be provided in the following format:
  -- ID --
  [[user]] **user query**
  [[bot]] **bot response**

  Provide the summary in the following format:

  [[ID]] **response**
  `;

export const HOME_PROMPTS = [
  "Hi! Who are you?",
  "Yeehaw! How are you and ol' bessy?",
  "Hi LLaMA 2, who created you?",
  "Hey, can you tell me a good dad joke?",
  "I would love some background music right now. Do you have a couple of song recommendations?",
];

export const replicate = new Replicate({
  auth: env.REPLICATE_TOKEN,
});

export function convertConversationToPromptInput(conversation: Conversation) {
  return {
    system_prompt: conversation.systemMessage ?? "",
    max_new_tokens: conversation.maxNewTokens ?? 500,
    min_new_tokens: conversation.minNewTokens ?? -1,
    temperature: conversation.temperature ?? 0.75,
  };
}

export function buildPromptHistory(exchanges: Exchange[], prompt?: string) {
  return exchanges.reduce(
    (acc: string, curr: Exchange) =>
      `${acc}
      [INST] ${curr.prompt} [/INST]
      ${curr.response}
      ${prompt ? "[INST] " + prompt + " [/INST]" : ""}
    `,
    ""
  );
}

export const runPrediction = async (input: {
  prompt: string;
  system_prompt?: string;
  max_new_tokens?: number;
  min_new_tokens?: number;
  temperature?: number;
}) => {
  const startTime = new Date();
  const output = (await replicate.run(PREDICTION_MODEL, { input })) as string[];
  const timeElapsed = +new Date() / 1000 - +startTime / 1000;
  return {
    response: output.join(""),
    timeElapsed,
  };
};

export const runSummaryPrediction = async (
  userQuery: string,
  botResponse: string,
  id: string
) => {
  return await runPrediction({
    prompt: `
    -- ${id} --
    [[user]] ${userQuery}
    [[bot]] ${botResponse}
    `,
    system_prompt: TITLE_SUMMARY_SYS_PROMPT,
  });
};
