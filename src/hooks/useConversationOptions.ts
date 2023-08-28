import type { ChatOptions } from "~/components/forms/chatOptions";
import { api } from "~/utils/api";
import { useState, useCallback } from "react";
import type { NextRouter } from "next/router";

const DEFAULT_CONVERSATION_OPTIONS: ChatOptions = {
  message: "",
  systemPrompt: "",
  temperature: 0.75,
  maxNewTokens: 500,
  minNewTokens: -1,
};

function useConversationOptions(router: NextRouter) {
  const createConversation = api.conversations.create.useMutation();

  const [conversationOptions, setConversationOptions] = useState<ChatOptions>({
    ...DEFAULT_CONVERSATION_OPTIONS,
  });
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleMessageSend = useCallback(async () => {
    if (conversationOptions.message) {
      const res = await createConversation.mutateAsync({
        prompt: conversationOptions.message,
        system_prompt: conversationOptions.systemPrompt,
        temperature: conversationOptions.temperature,
        max_new_tokens: conversationOptions.maxNewTokens,
        min_new_tokens: conversationOptions.minNewTokens,
      });
      const storedConversations = JSON.parse(
        localStorage.getItem("previousConversations") ?? "[]"
      ) as string[];
      storedConversations.push(res.conversation.id);
      await router.push(`/chat/${res.conversation.id}`);
    }
    console.log("missing initial message");
  }, [conversationOptions, createConversation, router]);

  return {
    createConversation,
    conversationOptions,
    setConversationOptions,
    isNewMessageModalOpen,
    setIsNewMessageModalOpen,
    showAdvancedOptions,
    setShowAdvancedOptions,
    handleMessageSend,
  };
}

export default useConversationOptions;
