"use client";

import { Companion } from "@prisma/client";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import { useEffect, useRef, useState } from "react";


interface Props {
    messages: ChatMessageProps[];
    isLoading: boolean;
    companion: Companion;
}

export default function ChatMessages({ messages = [], isLoading, companion }: Props) {


    const scrollRef = useRef<HTMLDivElement>(null);

    const [fakeLoading, setFakeLoading] = useState(messages.length === 0);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setFakeLoading(false)
        }, 1000);

        return () => {
            clearTimeout(timeout)
        }
    }, []);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages.length]);


    return (
        <div className="flex-1 overflow-y-auto pr-4">
            <ChatMessage
                isLoading={fakeLoading}
                src={companion.src}
                role="system"
                content={`Hello, i am ${companion.name}, ${companion.description}`}
            />
            {messages.map((message) => (
                <ChatMessage
                    key={message.content}
                    role={message.role}
                    content={message.content}
                    src={companion.src}
                />
            ))}
            {
                isLoading && (
                    <ChatMessage
                        role="system"
                        src={companion.src}
                        isLoading
                    />
                )
            }

            <div ref={scrollRef} />
        </div>
    )
}
