import { useEffect, useState } from "react";
import { api } from "~/utils/api";

export const HOME_PROMPTS = [
  "Hi! Who are you?",
  "Yeehaw! How are you and ol' bessy?",
  "Hi LLaMA 2, who created you?",
  "Hey, can you tell me a good dad joke?",
  "I would love some background music right now. Do you have a couple of song recommendations?",
];

function useHomePrediction() {
  const [index] = useState(Math.floor(Math.random() * 5));
  const homePrediction = api.predictions.homePrediction.useQuery({ index });
  const [history, setHistory] = useState<
    {
      isLoading: boolean;
      sender: "user" | "bot";
      messages: string[];
    }[]
  >([
    {
      isLoading: false,
      sender: "user",
      messages: HOME_PROMPTS[index]!.split("! "),
    },
    {
      isLoading: true,
      sender: "bot",
      messages: [],
    },
  ]);

  useEffect(() => {
    if (homePrediction.data) {
      setHistory([
        {
          isLoading: false,
          sender: "user",
          messages: HOME_PROMPTS[index]!.split("! "),
        },
        {
          isLoading: false,
          sender: "bot",
          messages: homePrediction.data.split("! "),
        },
      ]);
    }
  }, [homePrediction, setHistory, index]);

  return {
    index,
    homePrediction,
    history,
    setHistory,
  };
}

export default useHomePrediction;
