"use client";

import React, { useState } from "react";
import useSWRMutation from "swr/mutation";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import Input from "@/components/input";

import { useRouter } from "next/navigation";

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

const SignUpSchema = z
    .object({
        email: z.string().email().trim(),
        password: z.string().min(8).max(20).trim(),
        confirmPassword: z.string().min(8).max(20).trim(),
        login: z.string().min(3).max(20).trim(),
        name: z.string().min(3).max(20).trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export default function Form() {
    const { trigger, isMutating, error } = useSWRMutation(
        "/api/signup",
        sendRequest /* опции */
    );
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });

    const onSubmit = async (values: SignUpSchemaType) => {
        const formData = new FormData();

        for (const key in values) {
            //@ts-ignore
            formData.append(key, values[key]);
        }

        try {
            await trigger(formData);

            router.push("/login");
        } catch {
            console.log("error");
        }
    };

    return (
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-center text-sm text-rose-400">
                <div>{error && error.info ? error.info.message : null}</div>
            </div>
            <div className="space-y-5 rounded-md shadow-sm">
                <Input
                    {...register("email")}
                    autoComplete="email"
                    error={errors.email?.message}
                    id="email"
                    label="Email"
                    placeholder="you@example.com"
                    type="email"
                />
                <Input
                    {...register("password")}
                    autoComplete="new-password"
                    error={errors.password?.message}
                    id="password"
                    label="Password"
                    placeholder="Введите пароль"
                    type="password"
                />
                <Input
                    {...register("confirmPassword")}
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                    id="confirmPassword"
                    label="Repeat password"
                    placeholder="Повторите пароль"
                    type="password"
                />
                <Input
                    {...register("login")}
                    autoComplete="nickname"
                    error={errors.login?.message}
                    id="login"
                    label="Login"
                    placeholder="Ваш логин"
                    type="text"
                />
                <Input
                    {...register("name")}
                    autoComplete="username"
                    error={errors.name?.message}
                    id="name"
                    label="Name"
                    name="name"
                    placeholder="Ваше имя"
                    type="text"
                />
            </div>
            <button
                className="group relative h-14 w-full rounded-full border border-[#d5a25c]/30 bg-[#d5a25c] px-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#17130d] shadow-[0_20px_40px_rgba(213,162,92,0.22)] transition hover:-translate-y-0.5 hover:bg-[#ddb06b] focus:outline-none focus:ring-2 focus:ring-[#d5a25c]/35"
                disabled={isMutating}
                type="submit"
            >
                <span className="absolute inset-0 flex items-center justify-center text-center leading-none">
                    Создать доступ
                </span>
            </button>
        </form>
    );
}
