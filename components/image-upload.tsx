"use client"

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface ImageUploadProps {
    value?: string;
    onChange: (file: File) => void;
    onRemove: () => void;
    disabled?: boolean;
}

export const ImageUpload = ({ onChange, onRemove, value, disabled }: ImageUploadProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    if (!isMounted) return null;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
        onChange(file);
    };

    const handleRemove = () => {
        setPreview(null);
        onRemove();
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="space-y-4 w-full flex flex-col justify-center items-center">
            <div
                className="relative p-4 border-4 border-dashed border-primary/10 rounded-lg hover:opacity-75 
                           transition flex flex-col space-y-2 items-center justify-center cursor-pointer"
                onClick={() => !preview && inputRef.current?.click()}
            >
                <div className="relative h-40 w-40">
                    <Image
                        fill
                        alt="Preview"
                        src={preview || "/file.svg"}
                        className="rounded-lg object-cover"
                    />
                </div>

                {preview ? (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={(e) => { e.stopPropagation(); handleRemove(); }}
                        className="absolute top-0 right-0 text-sm text-destructive hover:underline"
                    >
                        <X className="h-12 w-12" />
                    </button>
                ) : (
                    <p className="text-sm font-bold text-muted-foreground">
                        Click to upload image
                    </p>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                disabled={disabled}
                onChange={handleFileChange}
            />
        </div>
    );
};