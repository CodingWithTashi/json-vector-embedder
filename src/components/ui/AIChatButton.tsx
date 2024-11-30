"use client";
import { useState } from "react";
import { Button } from "./button";
import { Bot } from "lucide-react";
import AiChatBot from "./AiChatBot";

export default function AIChatButton() {
  const [chatBotOpen, setChatBotOpen] = useState(false);

  return (
    <>
      <div className="justify-self-center">
        <Button onClick={() => setChatBotOpen(true)}>
          <Bot size={20} className="mr-3"></Bot>
          AI Chat
        </Button>
      </div>

      <AiChatBot open={chatBotOpen} onClose={() => setChatBotOpen(false)} />
    </>
  );
}
