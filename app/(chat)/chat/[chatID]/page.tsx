import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ChatClient from "./components/ChatClient";

interface Props {
    params: {
        chatID: string
    }
}

export default async function ChatIDPage({ params }: Props) {

    const { chatID } = await params;
    const { userId } = await auth();

    if (!userId) return redirect("/");

    const companion = await prisma.companion.findUnique({
        where: {
            id: chatID
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc"
                },
                where: {
                    userId
                }
            },
            _count: {
                select: {
                    messages: true
                }
            }
        }
    });

    if (!companion) return redirect("/");

    return (
        <ChatClient companion={companion} />
    )
}
