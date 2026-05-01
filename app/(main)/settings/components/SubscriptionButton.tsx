"use client"

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
    isPro: boolean;
}

export default function SubscriptionButton({isPro}: Props) {

    const [loading,setLoading] = useState(false);

    const onClick = async() => {
        try {
            setLoading(true);
            const response = await fetch(`/api/stripe`);
            const json = await response.json();

            window.location.href = json.url;

        } catch (error) {
            setLoading(false);
            console.log(`[SUBSCRIPTION_BUTTON]`, error)
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button onClick={onClick} size={"sm"} variant={isPro ? "default": "premium"}>
            {isPro ? "Manage Subscription": "Upgrade"}
            {!isPro && <Sparkles className="h-4 w-4 ml-2 fill-white" />}
        </Button>
    )
}
