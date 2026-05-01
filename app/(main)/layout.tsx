import { checkSubscription } from "@/lib/subscription";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

export default async function MainLayout({
    children
}: {
    children: React.ReactNode;
}) {

    const isPro = await checkSubscription();

    return (
        <div>
            <Navbar isPro={isPro} />
            <div className="hidden md:flex mt-16 w-20 flex-col fixed inset-y-0">
                <Sidebar isPro={isPro} />
            </div>
            <main className="h-full pt-16 md:pl-20">
                {children}
            </main>
        </div>
    );
}