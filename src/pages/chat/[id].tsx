import { Menu, Send } from "lucide-react";
import Loader from "../../components/loader";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import ChatDialog from "../../components/chatDialog";
import { useMemo, useRef, useState } from "react";

function ChatPage() {
  const [message, setMessage] = useState("");
  const chatSectionRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const conversation = api.conversations.get.useQuery({
    id: router.query.id as string,
  });
  const createExchange = api.conversations.exchange.useMutation();

  const messages = useMemo(() => {
    if (conversation.data)
      return conversation.data.exchanges.reduce(
        (
          acc: {
            id: string;
            dialogIndex: number;
            isBot: boolean;
            isUser: boolean;
            messages: string[];
          }[],
          cur: {
            id: string;
            prompt: string;
            response: string;
            timeElapsed: number;
            createdAt: string | null;
            conversationId: string;
          }
        ) => [
          ...acc,
          {
            id: `${cur.id}---user`,
            dialogIndex: 0,
            isBot: false,
            isUser: true,
            messages: [cur.prompt],
          },
          {
            id: `${cur.id}---bot`,
            dialogIndex: 0,
            isBot: true,
            isUser: false,
            messages: [cur.response],
          },
        ],
        []
      );
    return [];
  }, [conversation.data]);

  return (
    <>
      {conversation.data?.conversation && (
        <section className="fixed inset-x-0 top-0 flex justify-center gap-6 px-2 py-2 backdrop-blur-md">
          <div className="container flex w-full max-w-2xl items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100 bg-size-200 bg-pos-0 p-2 text-sm font-semibold text-zinc-800 transition-all duration-500 hover:scale-105 hover:bg-pos-100">
              <Menu />
              <span className="sr-only">View Previous Conversations</span>
            </button>
            <h1 className="truncate text-lg font-bold tracking-wide md:text-xl">
              {conversation.data.conversation.title}
            </h1>
          </div>
        </section>
      )}

      <section
        className="hide-scrollbar flex h-full w-full max-w-2xl flex-col gap-6 overflow-y-auto px-2 py-16 "
        ref={chatSectionRef}
      >
        {conversation.data &&
          messages.map((msg) => <ChatDialog {...msg} key={msg.id} />)}
      </section>
      <form
        className="fixed inset-x-0 bottom-0 flex justify-center gap-4 px-2 py-2 backdrop-blur-md"
        onSubmit={(e) => {
          e.preventDefault();
          if (message && conversation.data?.conversation) {
            createExchange
              .mutateAsync({
                id: conversation.data.conversation.id,
                prompt: message,
              })
              .then(async () => {
                await conversation.refetch();
                if (chatSectionRef.current)
                  chatSectionRef.current.scrollTop =
                    chatSectionRef.current.scrollHeight;
                setMessage("");
              })
              .catch(console.log);
          } else {
            console.log("missing message");
          }
        }}
      >
        <div className="container flex w-full max-w-2xl items-end gap-3">
          <textarea
            id="message"
            className="h-12 w-full rounded-lg border border-zinc-500 bg-zinc-700 p-3 text-white"
            placeholder="Hey there!"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          ></textarea>
          <button
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-pink-200 via-purple-300 to-indigo-300 bg-size-200 bg-pos-0 p-3 px-6 text-zinc-800 transition-all duration-500 hover:scale-[1.02] hover:bg-pos-100"
            type="submit"
          >
            <Loader
              isLoading={
                conversation.isLoading ||
                conversation.isRefetching ||
                createExchange.isLoading
              }
            >
              <Send />
            </Loader>
            <span className="hidden whitespace-nowrap md:block">Send</span>
          </button>
        </div>
      </form>
    </>
  );
}

export default ChatPage;
