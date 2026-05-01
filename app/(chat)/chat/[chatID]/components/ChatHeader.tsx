import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import BotAvatar from "./BotAvatar";
import { ChevronLeftIcon, Edit, MessagesSquare, MoreVertical, Trash } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Companion, Message } from "@prisma/client";


interface Props {
    companion: Companion & {
        messages: Message[];
        _count: {
            messages: number;
        }
    }
}


export default function ChatHeader({ companion }: Props) {

    const router = useRouter();
    const { user } = useUser();

    const onDelete = async () => {
        try {
            const response = await fetch(`/api/companion/${companion.id}`, {
                method: "DELETE"
            });

            if (!response.ok) return toast.error("Something went wrong");

            toast.success("CompAI deleted!");
            router.refresh();
            router.push("/");
        } catch (error) {
            toast.error("Something went wrong");
        }
    }

    return (
        <div className="flex w-full justify-between items-center border-b border-primary/10 pb-4">
            <div className="flex gap-x-2 items-center">

                <Button onClick={() => router.back()} variant={"ghost"}>
                    <ChevronLeftIcon className="h-12 w-12" />
                </Button>

                <BotAvatar src={companion.src} />

                <div className="flex flex-col gap-y-1">

                    <div className="flex items-center gap-x-2">
                        <p className="font-bold mr-1">
                            {companion.name}
                        </p>

                        <div className="flex items-center text-xs text-muted-foreground">
                            <MessagesSquare className="w-3 h-3 mr-1" />
                            {companion._count.messages}
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground">
                        Created by {companion.userName}
                    </p>

                </div>
            </div>

            {
                user?.id === companion.userId && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant={"secondary"} size={"icon"}>
                                <MoreVertical />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => router.push(`/companion/${companion.id}`)}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete}>
                                <Trash className="w-4 h-4 mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            }
        </div>
    )
}
