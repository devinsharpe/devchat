import Head from "next/head";
import { api } from "~/utils/api";
import { Cog, MessagesSquare, List, Send } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import ChatDialog from "~/components/chatDialog";
import Modal from "~/components/modal";
import ChatOptionsForms, {
  type ChatOptions,
} from "~/components/forms/chatOptions";
import { useRouter } from "next/router";

// Create Conversation flow
// - Additional options (system prompt, etc.)
// View & Open Previous Conversations Flow
// - Save conversation ids in local storage
// View Conversation Flow
// - Infinite scroll with auto loading
// - 1 trpc route for creating exchange and generating prediction

export default function Home() {
  // const hello = api.example.hello.useQuery({ text: "from tRPC" });
  const createPrediction = api.predictions.create.useMutation();
  const createConversation = api.conversations.create.useMutation();
  const [conversationOptions, setConversationOptions] = useState<ChatOptions>({
    message: "",
    systemPrompt: "",
    temperature: 0.75,
    maxNewTokens: 500,
    minNewTokens: -1,
  });
  const [isNewMessageModalOpen, setIsNewMessageModalOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
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
      messages: ["Hello! Who are you?"],
    },
    {
      isLoading: true,
      sender: "bot",
      messages: [],
    },
  ]);
  const router = useRouter();

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

  useEffect(() => {
    createPrediction
      .mutateAsync({
        prompt: "Hello! Who are you?",
      })
      .then((res) =>
        setHistory([
          ...history.slice(0, 1),
          {
            isLoading: false,
            sender: "bot",
            messages: res
              .join("")
              .split("!")
              .filter((msg) => !!msg),
          },
        ])
      )
      .catch((err) => console.log(err));
    //eslint-disable-next-line
  }, []);

  return (
    <>
      <Head>
        <title>DevChat</title>
        <meta
          name="description"
          content="A LLaMA2 chat client made just for fun"
        />
        <meta name="theme-color" content="#09090b" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen w-full flex-col items-center justify-center gap-12 bg-gradient-to-br from-zinc-800 via-zinc-950 to-black p-4 text-white">
        <div className="flex w-full max-w-2xl flex-col gap-2 pb-16">
          {history.map((history, index) => (
            <ChatDialog
              dialogIndex={index}
              isBot={history.sender === "bot"}
              isUser={history.sender === "user"}
              messages={history.messages}
              isLoading={history.isLoading}
              key={`dialog:${index}`}
            />
          ))}
        </div>
        <div className="fixed inset-x-0 bottom-0 flex justify-center gap-4  py-2 backdrop-blur-md">
          <button
            className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-pink-200 via-purple-300 to-indigo-300 bg-size-200 bg-pos-0 px-6 py-3 font-semibold text-zinc-800 transition-all duration-500 hover:scale-105 hover:bg-pos-100"
            onClick={() => {
              setShowAdvancedOptions(false);
              setIsNewMessageModalOpen(true);
            }}
          >
            <span>Start a Chat</span>
            <MessagesSquare />
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 bg-size-200 bg-pos-0 px-4 py-2 text-sm font-semibold text-zinc-800 transition-all duration-500 hover:scale-105 hover:bg-pos-100">
            <List />
            <span className="sr-only">View Previous Conversations</span>
          </button>
          <button
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-zinc-200 via-zinc-200 to-zinc-400 bg-size-200 bg-pos-0 px-4 py-2 text-sm font-semibold text-zinc-800 transition-all duration-500 hover:scale-105 hover:bg-pos-100"
            onClick={() => {
              setShowAdvancedOptions(true);
              setIsNewMessageModalOpen(true);
            }}
          >
            <Cog />
            <span className="sr-only">Configure</span>
          </button>
        </div>

        <Modal
          isOpen={isNewMessageModalOpen}
          onOpenChange={() => setIsNewMessageModalOpen(!isNewMessageModalOpen)}
          title="Start a Chat"
        >
          <ChatOptionsForms
            isLoading={createConversation.isLoading}
            options={conversationOptions}
            onChange={(opts) =>
              setConversationOptions({ ...conversationOptions, ...opts })
            }
            onShowAdvancedOptionsChange={setShowAdvancedOptions}
            onSubmit={() => handleMessageSend()}
            showAdvancedOptions={showAdvancedOptions}
          />
        </Modal>
      </main>
    </>
  );
}
