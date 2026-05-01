"use client";

import { useProModal } from "@/hooks/use-pro-modal";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useState } from "react";
import { toast } from "sonner";


export default function ProModal() {

    const proModal = useProModal();
    const [loading, setLoading] = useState(false);

    const onSubscribe = async() => {
        try {
            setLoading(true);
            const response = await fetch("/api/stripe");
            const json = await response.json();

            window.location.href = json.url;

        } catch (error) {
            setLoading(false);
            console.log("[/API/STRIPE ROUTE]", error)
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-center">
                        Upgrade to Pro!
                    </DialogTitle>

                    <DialogDescription className="text-center space-y-2 ">
                        Create <span className="text-sky-500 mx-1 font-medium">Custom AI</span> CompAI!
                    </DialogDescription>

                </DialogHeader>

                <Separator />
                
                <div className="flex justify-between">
                    <p className="text-2xl font-medium">
                        $9
                        <span className="text-sm font-normal">.99 / month</span>
                    </p>

                    <Button disabled={loading} onClick={onSubscribe} variant={"premium"}>
                        Subscribe
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}
