import { cn } from "@/lib/utils";
import { Bot, Trash, XCircle, User } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Message, useChat } from "ai/react";
interface AiChatBotProps {
  open: boolean;
  onClose: () => void;
}
export default function AiChatBot({ open, onClose }: AiChatBotProps) {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
    error,
  } = useChat(); //  /api/chat
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  const lastMessage = messages[messages.length - 1]?.role === "user";
  return (
    <div
      className={cn(
        "bottom-0 right-0 z-10 w-full max-w-[500px] xl:right-36",
        open ? "fixed" : "hidden"
      )}
    >
      <button onClick={onClose} className="mb-1 ms-auto block">
        <XCircle size={30} />
      </button>
      <div className="flex h-[600px] flex-col rounded border bg-background shadow-xl">
        <div className="mt-3 h-full overflow-y-auto px-3" ref={scrollRef}>
          {messages.map((message) => (
            <ChatMessage key={message.id} messages={message} />
          ))}
          {isLoading && lastMessage && (
            <ChatMessage
              messages={{
                role: "assistant",
                content: "Thinking...",
              }}
            />
          )}
          {error && (
            <ChatMessage
              messages={{
                role: "assistant",
                content: "Error occurred. Please try again.",
              }}
            />
          )}
          {!error && messages.length === 0 && (
            <ChatMessage
              messages={{
                role: "assistant",
                content: "Ask me anything!",
              }}
            />
          )}
        </div>

        <form onSubmit={handleSubmit} className="m-3 flex gap-1">
          <Button
            title="Clear Chat"
            variant="outline"
            size="icon"
            className="shrink-0"
            type="button"
            onClick={() => setMessages([])}
          >
            <Trash />
          </Button>
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Enter something"
            ref={inputRef}
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}
function ChatMessage({
  messages: { role, content },
}: {
  messages: Pick<Message, "role" | "content">;
}) {
  const isAiMessage = role === "assistant";
  return (
    <div
      className={cn(
        "mb-3 flex items-center",
        isAiMessage ? "me-5 justify-start" : "ms-5 justify-end"
      )}
    >
      {isAiMessage && <Bot className="mr-2 shrink-0" />}
      <p
        className={cn(
          "whitespace-pre-line rounded-md border px-3 py-2",
          isAiMessage ? "bg-background" : "bg-primary text-primary-foreground"
        )}
      >
        {content}
        {!isAiMessage && (
          <User
            width={100}
            height={100}
            className="ml-2 h-10 w-10 rounded-full object-cover"
          />
        )}
      </p>
    </div>
  );
}
