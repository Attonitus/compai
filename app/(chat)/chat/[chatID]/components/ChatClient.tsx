"use client";

import ChatHeader from "./ChatHeader";
import { useState } from "react";
import ChatForm from './ChatForm';
import ChatMessages from './ChatMessages';
import { ChatMessageProps } from './ChatMessage';
import { Companion, Message } from "@prisma/client";

interface Props {
    companion: Companion & {
        messages: Message[];
        _count: { messages: number; }
    }
}

export default function ChatClient({ companion }: Props) {
    const [messages, setMessages] = useState<ChatMessageProps[]>(companion.messages);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: ChatMessageProps = {
            role: "user",
            content: input
        };

        setMessages((current) => [...current, userMessage]);
        setIsLoading(true);
        const currentInput = input;
        setInput("");

        try {
            const response = await fetch(`/api/chat/${companion.id}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: currentInput })
            });

            if (!response.ok) throw new Error("Failed to get response");

            const text = await response.text();

            if (text.trim().length > 1) {
                setMessages((current) => [...current, {
                    role: "system",
                    content: text.trim()
                }]);
            }

        } catch (error) {
            console.error("[CHAT_ERROR]", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full p-4 space-y-2">
            <ChatHeader companion={companion} />
            <ChatMessages
                companion={companion}
                isLoading={isLoading}
                messages={messages}
            />
            <ChatForm
                isLoading={isLoading}
                input={input}
                handleInputChange={(e) => setInput(e.target.value)}
                onSubmit={onSubmit}
            />
        </div>
    );
}