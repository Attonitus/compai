import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
    src: string;
}

export default function BotAvatar({ src }: Props) {
    return (
        <Avatar className="w-12 h-12" >
            <AvatarImage src={src} alt="Avatar" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
    )
}
