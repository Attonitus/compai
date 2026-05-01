"use client";

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { Category, Companion } from "@/app/generated/prisma/browser"
import * as z from "zod"
import { toast } from "sonner"
import { Separator } from "@/components/ui/separator";
import { ImageUpload } from "@/components/image-upload";
import { useRef } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { getPresignedUrl } from "@/app/actions/upload-action";
import { useRouter } from "next/navigation";


interface Props {
    initialData: Companion | null,
    categories: Category[]
}


const formSchema = z.object({
    name: z
        .string().min(1, "Name is required"),
    description: z
        .string().min(1, "Description is required"),
    instructions: z
        .string().min(8, "Instructions require at least 8 characters"),
    seed: z
        .string().min(8, "Seed require 8 characters"),
    src: z
        .string().min(1, "Image is required"),
    categoryId: z.string().min(1, "Category is required")

})

export default function CompanionForm({ categories, initialData }: Props) {
    const router = useRouter()

    const pendingFileRef = useRef<File | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: ""
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        try {

            if (initialData) {
                await fetch(`/api/companion/${initialData.id}`, {
                    method: "PATCH",
                    body: JSON.stringify(data),
                    headers: { "Content-Type": "application/json" },
                });

                toast.success("CompAI editado correctamente");
                router.refresh();
                router.push("/");
            } else {

                let imageUrl = data.src;

                if (pendingFileRef.current) {
                    const file = pendingFileRef.current;

                    // 1. Pide la URL firmada al servidor
                    const signedUrl = await getPresignedUrl(file.name, file.type);

                    // 2. Sube directo a S3 desde el cliente
                    const uploadRes = await fetch(signedUrl, {
                        method: "PUT",
                        body: file,
                        headers: { "Content-Type": file.type },
                    });

                    if (!uploadRes.ok) throw new Error("Error al subir la imagen");

                    // 3. La URL final es la presigned URL sin los query params
                    imageUrl = signedUrl.split("?")[0];

                    await fetch(`/api/companion/`, {
                        method: "POST",
                        body: JSON.stringify({
                            ...data,
                            src: imageUrl
                        }),
                        headers: { "Content-Type": "application/json" },
                    })
                }

                toast.success("CompAI creado correctamente");
                router.refresh();
                router.push("/");
            }

        } catch (error: any) {
            toast.error(`Error al subir la imagen ${error}`);
        }
    };


    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
                <div className="space-y-2 w-full">
                    <div>
                        <h3 className="text-lg font-medium">General Information</h3>
                        <p className="text-sm text-muted-foreground">General information about your CompAI</p>
                    </div>

                    <Separator className="bg-primary/10" />

                </div>

                <ImageUpload
                    value={initialData?.src}
                    disabled={form.formState.isSubmitting}
                    onChange={(file) => {
                        pendingFileRef.current = file;
                        form.setValue("src", file.name, { shouldValidate: true });
                    }}
                    onRemove={() => {
                        pendingFileRef.current = null;
                        form.setValue("src", "", { shouldValidate: true });
                    }}
                />

                {form.formState.errors.src && (
                    <p className="text-sm text-destructive text-center">
                        {form.formState.errors.src.message}
                    </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    <div className="col-span-2 md:col-span-1">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="name">
                                        Name
                                    </FieldLabel>
                                    <Input
                                        className="bg-background"
                                        {...field}
                                        id="name"
                                        placeholder="Dave Strider"
                                        disabled={form.formState.isSubmitting}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}

                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <Controller
                            name="description"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="description">
                                        Short description
                                    </FieldLabel>
                                    <Input
                                        className="bg-background"
                                        {...field}
                                        id="description"
                                        placeholder="Fictional character from Homestuck"
                                        disabled={form.formState.isSubmitting}
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}

                        />
                    </div>

                    <div className="col-span-2 md:col-span-1">
                        <Controller
                            name="categoryId"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="categoryId">
                                        Category
                                    </FieldLabel>
                                    <Select
                                        disabled={form.formState.isSubmitting}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        defaultValue={field.value}
                                    >
                                        <SelectTrigger className="bg-background">
                                            <SelectValue
                                                defaultValue={field.value}
                                                placeholder="Select a category"
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((category) => (
                                                <SelectItem
                                                    key={category.id}
                                                    value={category.id}
                                                >
                                                    {category.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>

                                    </Select>
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}

                        />
                    </div>

                </div>

                <div className="space-y-2 w-full">
                    <div>
                        <h3 className="text-lg font-medium">Configuration</h3>
                        <p className="text-sm text-muted-foreground">
                            Detailed instructions for AI Behaviour
                        </p>
                    </div>
                    <Separator className="bg-primary/10" />
                </div>

                <Controller
                    name="instructions"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="instructions">
                                Instructions
                            </FieldLabel>
                            <Textarea
                                className="bg-background resize-none"
                                rows={7}
                                {...field}
                                id="instructions"
                                placeholder="You are Dave Strider from Homestuck"
                                disabled={form.formState.isSubmitting}
                            />
                            <FieldDescription>
                                Describe in detail your CompAI backstory and relevant details.
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <Controller
                    name="seed"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                            <FieldLabel htmlFor="seed">
                                Seed
                            </FieldLabel>
                            <Textarea
                                className="bg-background resize-none"
                                rows={7}
                                {...field}
                                id="seed"
                                placeholder={`Human: Hello Dave Strider!.
Dave Strider: What's up. Dave Strider in the house. You know how it is.
        leans against a wall, shades on
So what brings you to my corner of the internet? Hope you're ready for some quality ironic banter because that's basically all I've got on offer. Well, that and occasional wisdom that'll go right over your head.
So. Wassup. Talk to me.
                                `}
                                disabled={form.formState.isSubmitting}
                            />
                            <FieldDescription>
                                Describe in detail your CompAI chat example.
                            </FieldDescription>
                            {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                            )}
                        </Field>
                    )}
                />

                <div className="w-full flex justify-center">
                    <Button size={"lg"} disabled={form.formState.isSubmitting}>
                        {initialData ? "Edit your CompAI" : "Create your CompAI"}
                        <Wand2 className="w-4 h-4 ml-2" />
                    </Button>
                </div>
            </form>
        </div>
    )
}
