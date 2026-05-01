import { MemoryManager } from "@/lib/memory";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rate-limit";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { streamText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";

const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: process.env.OPENROUTER_AI_KEY,
});

export async function POST(req: Request, { params }: { params: Promise<{ chatId: string }> }) {
    try {
        const { chatId } = await params;
        const { prompt } = await req.json();

        const user = await currentUser();
        if (!user || !user.firstName || !user.id)
            return new NextResponse("Unauthorized", { status: 401 });

        const identifier = req.url + "-" + user.id;
        const { success } = await rateLimit(identifier);
        if (!success)
            return new NextResponse("Rate limit exceeded", { status: 429 });

        const companion = await prisma.companion.update({
            where: { id: chatId },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: "user",
                        userId: user.id
                    }
                }
            }
        });

        if (!companion)
            return new NextResponse("Companion not found", { status: 404 });

        const name = companion.id;
        const companion_file_name = name + ".txt";

        const companionKey = {
            companionName: name,
            userId: user.id,
            modelName: "minimax/minimax-m2.7"
        };

        const memoryManager = await MemoryManager.getInstance();
        const records = await memoryManager.readLatestHistory(companionKey);

        if (records.length === 0) {
            await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
        }

        await memoryManager.writeToHistory("User: " + prompt + "\n", companionKey);

        const recentChatHistory = await memoryManager.readLatestHistory(companionKey);
        const similarDocs = await memoryManager.vectorSearch(recentChatHistory, companion_file_name);

        let relevantHistory = "";
        if (!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
        }

        // ✅ Esperar el texto completo en vez de streamear
        const result = streamText({
            model: openrouter("minimax/minimax-m2.7"),
            messages: [
                {
                    role: "system",
                    content: `
                        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix.
                        
                        IMPORTANT - FORMAT RULES:
                        - Physical actions, expressions and gestures MUST always be wrapped in asterisks. Example: *smiles warmly* or *claps hands together*
                        - Dialogue is written normally without any special formatting.
                        - Always alternate naturally between actions and dialogue.
                        - Never write an action without asterisks.
                
                        Correct format example:
                        *claps hands together and tilts head* Well, hello! *smiles* It's so wonderful to see you!
                
                        Wrong format example:
                        claps hands together and tilts head Well, hello!
                        
                        ${companion.instructions}
                        
                        Below are relevant details about ${companion.name}'s past and the conversation you are in.
                        ${relevantHistory}
                        
                        ${recentChatHistory}\n${companion.name}:
                    `
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
        });

        const text = await result.text;

        if (text.trim().length > 1) {
            await memoryManager.writeToHistory(
                companion.name + ": " + text.trim() + "\n",
                companionKey
            );
            await prisma.companion.update({
                where: { id: chatId },
                data: {
                    messages: {
                        create: {
                            content: text.trim(),
                            role: "system",
                            userId: user.id
                        }
                    }
                }
            });
        }

        return new NextResponse(text, { status: 200 });

    } catch (error) {
        console.log("[CHAT_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}