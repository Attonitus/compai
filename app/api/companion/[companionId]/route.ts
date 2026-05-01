import prisma from "@/lib/prisma";
import { checkSubscription } from "@/lib/subscription";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function PATCH(req: Request, { params }: { params: { companionId: string } }) {
    try {
        const { companionId } = await params;
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, categoryId } = body;

        if (!companionId) return new NextResponse("Companion ID is required", { status: 401 });

        if (!user || !user.id || !user.firstName) return new NextResponse("Unauthorized", { status: 401 });

        if (!src || !name || !description || !instructions || !seed || !categoryId) return new NextResponse("Missing required fields", { status: 400 });

        const isPro = await checkSubscription();

        if (!isPro) {
            return new NextResponse("Pro subscription required", { status: 403 })
        }

        const compa = await prisma.companion.findUnique({
            where: {
                id: companionId
            }
        });

        if (!compa) return new NextResponse("Not companion");

        if (user.id !== compa.userId) return new NextResponse("You arent allowed to patch this companion");

        const companion = await prisma.companion.update({
            where: {
                id: companionId
            },
            data: {
                categoryId,
                userId: user.id,
                userName: user.firstName,
                src,
                name,
                description,
                instructions,
                seed
            }
        });

        return NextResponse.json(companion);

    } catch (error) {
        console.log("[COMPANION_PATCH]", error)
        return new NextResponse("Internal error", { status: 500 })
    }
}


export async function DELETE(req: Request, { params }: { params: { companionId: string } }) {
    try {
        const { userId } = await auth();
        const { companionId } = await params;

        if (!userId) return new NextResponse("Unauthorized", { status: 401 })

        const companion = await prisma.companion.findUnique({
            where: {
                id: companionId
            }
        });

        if (!companion) return new NextResponse("CompAI not found", { status: 400 });

        if (userId !== companion.userId) return new NextResponse("Not method allowed", { status: 405 });

        const companionToDelete = await prisma.companion.delete({
            where: {
                userId,
                id: companionId
            }
        });

        return NextResponse.json(companionToDelete)

    } catch (error) {
        console.log("[COMPANION_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
}