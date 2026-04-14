"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import useSWRMutation from "swr/mutation";
import { useForm } from "react-hook-form";
import ReactCountryFlag from "react-country-flag";

import Input from "@/components/input";
import Spinner from "@/components/spinner";

import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { type Item } from "@/models/types";
import { COUNTRY } from "../(home)/card/constants";

async function sendRequest(url: string, { arg }: { arg: FormData }) {
    const res = await fetch(url, {
        method: "POST",
        body: arg,
    });

    if (!res.ok) {
        const error: any = new Error(
            "An error occurred while fetching the data."
        );
        // Attach extra info to the error object.
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }

    return res.json();
}

async function sendPutRequest(url: string, { arg }: { arg: FormData }) {
    const res = await fetch(url, {
        method: "PUT",
        body: arg,
    });

    if (!res.ok) {
        const error: any = new Error(
            "An error occurred while fetching the data."
        );
        // Attach extra info to the error object.
        error.info = await res.json();
        error.status = res.status;
        throw error;
    }

    return res.json();
}

const CreateBottleSchema = z.object({
    name: z.string().trim(),
    type: z.string().trim(),
    strength: z.string().or(z.number()),
    countryOrigin: z.string(),
    user: z.string(),
    image: z.any().or(z.string()).optional().nullable(),
});

type CreateBottleSchemaType = z.infer<typeof CreateBottleSchema>;

export default function Form({
    item = null,
    users = [],
    types = [],
}: {
    item?: null | Item | any;
    users?: (string | null)[];
    types?: (string | null)[];
}) {
    const [show, setShow] = useState(false);
    const [availableTypes, setAvailableTypes] = useState(
        types.filter(Boolean) as string[]
    );
    const [newTypeName, setNewTypeName] = useState("");
    const fieldClassName =
        "relative mb-4 block h-12 w-full appearance-none rounded-xl border border-white/8 bg-[#0d1118] px-3.5 py-2 text-sm text-stone-100 outline-none transition focus:border-[#d5a25c]/45 focus:ring-2 focus:ring-[#d5a25c]/15";
    const defaultValues = item ? { ...item, image: null } : {};
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isDirty },
        reset,
        trigger: triggerForm,
    } = useForm<CreateBottleSchemaType>({
        resolver: zodResolver(CreateBottleSchema),
        // mode: "onChange",
        defaultValues,
    });

    const {
        trigger,
        isMutating,
        error,
        reset: resetMutation,
    } = useSWRMutation(
        !item ? "/api/bottles/add" : `/api/bottles/${item.id}`,
        !item ? sendRequest : sendPutRequest
    );
    const [isTypeCreating, setIsTypeCreating] = useState(false);

    const [isFileFormatting, setIsFileFormatting] = useState(false);

    const handleTypeCreate = async () => {
        const normalizedType = newTypeName.trim();

        if (!normalizedType) {
            toast.error("Введите название типа");
            return;
        }

        if (
            availableTypes.some(
                (type) => type.toLowerCase() === normalizedType.toLowerCase()
            )
        ) {
            toast.info("Такой тип уже есть в списке");
            return;
        }

        try {
            setIsTypeCreating(true);

            const formData = new FormData();
            formData.append("type", normalizedType);

            const response = await fetch("/api/types/add", {
                body: formData,
                method: "POST",
            });
            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.message || "Ошибка добавления типа");
            }

            const createdType = payload.type || normalizedType;

            setAvailableTypes((prev) =>
                [...prev, createdType].sort((left, right) =>
                    left.localeCompare(right, "ru")
                )
            );
            setNewTypeName("");
            setValue("type", createdType, { shouldDirty: true });
            toast.success(payload.message || "Тип добавлен");
        } catch (error) {
            console.error(error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Не удалось добавить тип"
            );
        } finally {
            setIsTypeCreating(false);
        }
    };

    const onSubmit = async (values: any) => {
        try {
            const formData = new FormData();

            formData.append("name", values.name);
            formData.append("type", values.type);
            formData.append("strength", values.strength);
            formData.append("countryOrigin", values.countryOrigin);
            formData.append("user", values.user);

            if (values.image && values.image.length > 0) {
                setIsFileFormatting(true);
                let newImage = values.image[0];

                const name = values.image[0]?.name?.split(".")?.[0];

                if (values.image[0].type === "image/heic") {
                    const heic2any = (await import("heic2any")).default;

                    newImage = await heic2any({
                        blob: values.image[0],
                    }).then(
                        (blob) =>
                            //@ts-ignore
                            new File([blob], name + ".png", {
                                type: "image/png",
                            })
                    );
                }

                formData.append("image", newImage);
            }
            setIsFileFormatting(false);

            await trigger(formData);

            toast.success("Ты только что добавил еще одну бутылку бормотухи");
            resetMutation();
            !item && reset();
        } catch (err) {
            console.error(err);

            toast.error(JSON.stringify(err) || "Ошибка");
        }
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div
                className={`flex justify-center ${
                    show ? "visible" : "invisible h-0"
                }`}
            >
                <img
                    className="h-44 w-44 rounded-[24px] border border-white/8 object-cover"
                    id="output"
                />
            </div>
            <div className="flex justify-center text-sm text-rose-400">
                <div>{error && error.info ? error.info.message : null}</div>
            </div>
            <div className="space-y-5 rounded-md shadow-sm">
                <Input
                    id="name"
                    label="Name"
                    placeholder="Название бутылки"
                    type="text"
                    required
                    {...register("name")}
                    error={errors.name?.message}
                />
                <div className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <div className="mb-3">
                        <p className="m-0 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-stone-500">
                            New type
                        </p>
                    </div>
                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                        <input
                            className="relative block h-12 w-full appearance-none rounded-xl border border-white/8 bg-[#0d1118] px-3.5 py-2 text-sm text-stone-100 placeholder-stone-500 outline-none transition focus:border-[#d5a25c]/45 focus:ring-2 focus:ring-[#d5a25c]/15"
                            placeholder="Новый тип алкоголя"
                            type="text"
                            value={newTypeName}
                            onChange={(event) =>
                                setNewTypeName(event.target.value)
                            }
                        />
                        <button
                            className="h-12 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm font-semibold uppercase tracking-[0.16em] text-stone-100 transition hover:bg-white/[0.08] focus:outline-none focus:ring-2 focus:ring-[#d5a25c]/20 disabled:cursor-not-allowed disabled:opacity-50"
                            disabled={isTypeCreating}
                            type="button"
                            onClick={handleTypeCreate}
                        >
                            {isTypeCreating ? "Сохраняю..." : "Добавить type"}
                        </button>
                    </div>
                </div>
                <div className="min-w-0">
                    <label
                        className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-stone-500"
                        htmlFor="type"
                    >
                        Type
                    </label>
                    <select
                        className={fieldClassName}
                        id="type"
                        {...register("type")}
                        required
                    >
                        <option value="">-- Выберите тип --</option>
                        {availableTypes?.map((type) => (
                            <option key={type} value={type?.toString()}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>
                <Input
                    id="strength"
                    label="Strength"
                    placeholder="Крепость"
                    type="number"
                    step="0.01"
                    required
                    {...register("strength")}
                    error={errors.strength?.message}
                />
                <div className="min-w-0">
                    <label
                        className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-stone-500"
                        htmlFor="origin"
                    >
                        Country
                    </label>
                    <select
                        className={fieldClassName}
                        id="origin"
                        {...register("countryOrigin")}
                        required
                    >
                        <option value="">-- Выберите страну --</option>
                        {Object.keys(COUNTRY).map((country) => (
                            <option key={country} value={country}>
                                {country}{" "}
                                <ReactCountryFlag
                                    countryCode={
                                        //@ts-ignore
                                        COUNTRY[country] ?? ""
                                    }
                                />
                            </option>
                        ))}
                    </select>
                </div>
                <div className="min-w-0">
                    <label
                        className="mb-2 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-stone-500"
                        htmlFor="user"
                    >
                        Owner
                    </label>
                    <select
                        className={fieldClassName}
                        id="user"
                        {...register("user")}
                        required
                    >
                        <option value="">-- Выберите владельца --</option>
                        {users?.map((user) => (
                            <option key={user} value={user?.toString()}>
                                {user}
                            </option>
                        ))}
                    </select>
                </div>
                <Input
                    accept="image/*, .heic"
                    id="image"
                    label="Image"
                    placeholder="Изображение"
                    type="file"
                    {...register("image")}
                    error={errors.image?.message}
                    onChange={async (event: any) => {
                        setShow(true);
                        let newImage = event.target.files[0];

                        if (event.target.files[0].type === "image/heic") {
                            setIsFileFormatting(true);
                            const heic2any = (await import("heic2any")).default;

                            newImage = await heic2any({
                                blob: event.target.files[0],
                                toType: "image/png",
                            });
                            setIsFileFormatting(false);
                        }

                        const output = document.getElementById("output");
                        //@ts-ignore
                        output.src = URL.createObjectURL(newImage);
                        //@ts-ignore
                        output.onload = function () {
                            //@ts-ignore
                            URL.revokeObjectURL(output?.src); // free memory
                        };
                    }}
                />
            </div>
            {!isMutating && !isFileFormatting ? (
                <div>
                    <button
                        className="group relative h-14 w-full rounded-full border border-[#d5a25c]/30 bg-[#d5a25c] px-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#17130d] shadow-[0_20px_40px_rgba(213,162,92,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ddb06b] focus:outline-none focus:ring-2 focus:ring-[#d5a25c]/35"
                        type="submit"
                    >
                        <span className="absolute inset-0 flex items-center justify-center text-center leading-none">
                            {item
                                ? "Сохранить изменения"
                                : "Добавить бутылку"}
                        </span>
                    </button>
                </div>
            ) : (
                <Spinner screen="grid place-items-center py-4" />
            )}
        </form>
    );
}
