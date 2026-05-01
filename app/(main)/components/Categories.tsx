"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import { useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

interface Props {
    data: Category[];
}

export default function Categories({ data }: Props) {
    const router = useRouter();

    const searchParams = useSearchParams();

    const categoryId = searchParams.get("categoryId");

    const onClick = (id: string | undefined) => {
        const query = { categoryId: id }

        const url = qs.stringifyUrl({
            url: window.location.href,
            query
        }, { skipNull: true });

        router.push(url);
    }

    return (
        <div className="w-full overflow-x-auto space-x-2 flex p-1">
            <Button className={cn("", !categoryId ? "bg-primary/25" : "bg-primary/10")} onClick={() => onClick(undefined)} variant={"category"} size={"lg"}>
                Newest
            </Button>
            {
                data.map((category) => (
                    <Button className={cn("", category.id === categoryId ? "bg-primary/25" : "bg-primary/10")} onClick={() => onClick(category.id)} key={category.id} variant={"category"} size={"lg"}>
                        {category.name}
                    </Button>
                ))
            }
        </div>
    )
}
