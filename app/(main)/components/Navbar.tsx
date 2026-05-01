"use client"
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClerkLoaded, ClerkLoading, Show, SignInButton, UserButton } from "@clerk/nextjs";
import { Loader, Sparkles } from "lucide-react";
import { Poppins } from "next/font/google";
import Link from "next/link";
import MobileSidebar from "./MobileSidebar";
import { useProModal } from "@/hooks/use-pro-modal";

const font = Poppins({
    weight: "600",
    subsets: ["latin"]
})

interface Props {
    isPro: boolean;
}

export default function Navbar({ isPro }: Props) {

    const proModal = useProModal();

    return (
        <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
            <div>
                <MobileSidebar />
                <Link href={"/"} className="hidden md:block">
                    <h1 className={cn("text-xl md:text-3xl font-bold text-primary",
                        font.className
                    )}>
                        CompAI</h1>
                </Link>
            </div>

            <div className="flex items-center gap-x-3">
                {
                    !isPro && (
                        <Button onClick={proModal.onOpen} variant={"premium"} size={"sm"}>
                            Upgrade
                            <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
                        </Button>
                    )
                }

                <ModeToggle />


                <ClerkLoading>
                    <Loader className="h-5 w-5 text-shadow-muted-foreground animate-spin" />
                </ClerkLoading>

                <ClerkLoaded>
                    <Show when={"signed-in"}>
                        <UserButton />
                    </Show>

                    <Show when={"signed-out"}>
                        <SignInButton mode="modal">
                            <Button size={"lg"} variant={"ghost"}>
                                Login
                            </Button>
                        </SignInButton>
                    </Show>

                </ClerkLoaded>
            </div>
        </div>
    )
}
