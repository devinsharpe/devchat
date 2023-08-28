import { Cog, MessagesSquare } from "lucide-react";
import ChatDialog from "~/components/chatDialog";
import Modal from "~/components/modal";
import { useRouter } from "next/router";
import TopNav from "~/components/topNav";
import useClientside from "~/hooks/useClientside";
import ChatOptionsForm from "~/components/forms/chatOptions";
import useConversationOptions from "~/hooks/useConversationOptions";
import useHomePrediction from "~/hooks/useHomePrediction";

// Create Conversation flow ✅
// - Additional options (system prompt, etc.) ✅
// View & Open Previous Conversations Flow
// - Save conversation ids in local storage ✅
// View Conversation Flow
// - Infinite scroll with auto loading
// - 1 trpc route for creating exchange and generating prediction ✅
// Title Generation flow using webhooks
// Edit conversation options after initial message
// Billing and rate limiting checks
// Add caching for homepage conversation options (1/day) ✅
// Add response loading indicators to chat page
// Clean up var/key names for consistency (message -> prompt, systemMessage -> systemPrompt, etc.)

export default function Home() {
  const router = useRouter();
  const { isClient } = useClientside();
  const {
    createConversation,
    conversationOptions,
    setConversationOptions,
    isNewMessageModalOpen,
    setIsNewMessageModalOpen,
    showAdvancedOptions,
    setShowAdvancedOptions,
    handleMessageSend,
  } = useConversationOptions(router);
  const { history } = useHomePrediction();

  return (
    <>
      <TopNav title="DevChat" />

      {isClient && (
        <section className="flex h-full w-full max-w-2xl flex-col gap-2 overflow-y-auto px-2 py-16 ">
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
        </section>
      )}

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
        <ChatOptionsForm
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
    </>
  );
}
