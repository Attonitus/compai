import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./Sidebar";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";

interface Props {
    isPro: boolean;
}

export default function MobileSidebar({isPro}: Props) {

    return (
        <Sheet>
            <SheetTrigger className="md:hidden pr-4">
                <Menu />
            </SheetTrigger>

            <SheetContent side="left" className="p-0 bg-secondary pt-10 w-28" aria-describedby={undefined}>
                <VisuallyHidden.Root>
                    <SheetTitle>Menú de navegación</SheetTitle>
                    <SheetDescription>Sidebar de navegación móvil</SheetDescription>
                </VisuallyHidden.Root>
                <h2 className="text-center text-xl font-bold">
                    CompAI
                </h2>
                <Sidebar isPro={isPro} />
            </SheetContent>
        </Sheet>
    )
}
