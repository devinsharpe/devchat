import { Bot, User } from "lucide-react";
import { cn } from "~/utils/cn";

interface ChatMessageProps {
  index: number;
  isBot: boolean;
  isUser: boolean;
  message: string;
}

function ChatMessage({ isBot, isUser, index, message }: ChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-3",
        isUser ? "justify-end" : ""
      )}
    >
      <BotAvatar className={index !== 0 ? "invisible" : ""} isVisible={isBot} />
      <h1 className="rounded-l-2xl rounded-r-2xl bg-zinc-800 px-6 py-4 shadow-lg">
        {message}
      </h1>
      <UserAvatar
        className={index !== 0 ? "invisible" : ""}
        isVisible={isUser}
      />
    </div>
  );
}

interface LoadingChatMessageProps {
  index: number;
  isBot: boolean;
  isUser: boolean;
}

function LoadingChatMessage({ index, isBot, isUser }: LoadingChatMessageProps) {
  return (
    <div
      className={cn(
        "flex w-full items-center gap-3",
        isUser ? "justify-end" : ""
      )}
    >
      <BotAvatar className={index !== 0 ? "invisible" : ""} isVisible={isBot} />
      <h1 className="flex gap-1 rounded-l-2xl rounded-r-2xl bg-zinc-800 px-6 py-4 shadow-lg">
        <span className="my-1 block h-3 w-3 animate-bounce rounded-full bg-zinc-600" />
        <span className="my-1 block h-3 w-3 animate-bounce rounded-full bg-zinc-600 delay-75" />
        <span className="my-1 block h-3 w-3 animate-bounce rounded-full bg-zinc-600 delay-150" />
      </h1>
      <UserAvatar
        className={index !== 0 ? "invisible" : ""}
        isVisible={isUser}
      />
    </div>
  );
}

interface ChatDialogProps {
  dialogIndex: number;
  isLoading?: boolean;
  isBot: boolean;
  isUser: boolean;
  messages: string[];
}

function BotAvatar({
  className,
  isVisible,
}: {
  className?: string;
  isVisible: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-rose-400 via-fuchsia-500 to-indigo-500 p-4 text-white",
        isVisible ? "" : "hidden",
        className
      )}
    >
      <Bot />
    </div>
  );
}

function UserAvatar({
  className,
  isVisible,
}: {
  className?: string;
  isVisible: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-full bg-gradient-to-br from-green-400 via-emerald-500 to-blue-600 p-4 text-white",
        isVisible ? "" : "hidden",
        className
      )}
    >
      <User />
    </div>
  );
}

function ChatDialog({
  dialogIndex,
  isLoading = false,
  isBot,
  isUser,
  messages,
}: ChatDialogProps) {
  return (
    <>
      {messages.map((msg, index) => (
        <ChatMessage
          index={index}
          isBot={isBot}
          isUser={isUser}
          message={msg}
          key={`${dialogIndex}:${index}`}
        />
      ))}
      {isLoading && (
        <LoadingChatMessage
          index={messages.length}
          isBot={isBot}
          isUser={isUser}
        />
      )}
    </>
  );
}

export default ChatDialog;
