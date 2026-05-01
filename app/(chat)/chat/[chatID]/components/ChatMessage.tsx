"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import BotAvatar from "./BotAvatar";
import { BeatLoader } from "react-spinners";
import UserAvatar from "./UserAvatar";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useState } from "react";
import FormattedMessage from "./FormattedMessage";

export interface ChatMessageProps {
    role: "system" | "user",
    content?: string;
    isLoading?: boolean;
    src?: string;
}

export default function ChatMessage({ role, content, isLoading, src }: ChatMessageProps) {
    const { theme } = useTheme();

    const onCopy = () => {
        if (!content) return;
        const cleanText = content.replace(/\*[^*]+\*/g, "").trim();
        navigator.clipboard.writeText(cleanText);
        toast.success("Message copied to clipboard");
    }

    const isUser = role === "user";

    return (
        <div
            className={cn(
                "group flex items-start gap-x-3 py-4 w-full",
                isUser && "justify-end"
            )}
        >
            {!isUser && src && <BotAvatar src={src} />}
            <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
                {isLoading
                    ? <BeatLoader size={5} color={theme === "light" ? "black" : "white"} />
                    : content && <FormattedMessage text={content} />
                }
            </div>

            {isUser && <UserAvatar />}

            {!isUser && !isLoading && (
                <Button
                    onClick={onCopy}
                    className="opacity-0 group-hover:opacity-100 transition"
                    size="icon"
                    variant="ghost"
                >
                    <Copy className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}