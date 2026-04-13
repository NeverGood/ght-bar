"use client";

import React from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import Input from "@/components/input";
import Select from "@/components/select";
import type { CatalogFilterOptions } from "@/lib/bottle-catalog";

import useSubmit from "./use-submit";

const FilterSchema = z.object({
    type: z.string().optional(),
    strength: z.string().max(5).optional(),
    name: z.string().optional(),
    countryOrigin: z.string().optional(),
    user: z.string().optional(),
});

export type FilterSchemaType = z.infer<typeof FilterSchema>;

export default function Form({
    setQuery,
    filterOptions,
}: {
    setQuery?: any;
    filterOptions: CatalogFilterOptions;
}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const type = searchParams.get("type") || "";
    const strength = searchParams.get("strength") || "";
    const name = searchParams.get("name") || "";
    const countryOrigin = searchParams.get("countryOrigin") || "";
    const user = searchParams.get("user") || "";

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FilterSchemaType>({
        defaultValues: { type, strength, name, countryOrigin, user },
        resolver: zodResolver(FilterSchema),
    });

    const onSubmit = useSubmit(setQuery);
    const hasActiveFilters = Boolean(
        type || strength || name || countryOrigin || user
    );

    return (
        <form
            className="grid grid-cols-5 gap-3 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1"
            onSubmit={handleSubmit(onSubmit)}
        >
            <Select
                {...register("type")}
                error={errors.type?.message}
                id="type"
                label="Тип"
                options={filterOptions.types.map((value) => ({
                    label: value,
                    value,
                }))}
                placeholder="Любой тип"
            />
            <Select
                {...register("strength")}
                error={errors.strength?.message}
                id="strength"
                label="Крепость"
                options={filterOptions.strengths.map((value) => ({
                    label: `${value}%`,
                    value,
                }))}
                placeholder="Любая крепость"
            />
            <Select
                {...register("user")}
                error={errors.user?.message}
                id="user"
                label="Владелец"
                options={filterOptions.users.map((value) => ({
                    label: value,
                    value,
                }))}
                placeholder="Любой владелец"
            />
            <Input
                {...register("name")}
                error={errors.name?.message}
                id="name"
                label="Название"
                placeholder="Название бутылки"
                type="text"
                autoComplete
            />
            <Select
                {...register("countryOrigin")}
                error={errors.countryOrigin?.message}
                id="countryOrigin"
                label="Страна"
                options={filterOptions.countries.map((value) => ({
                    label: value,
                    value,
                }))}
                placeholder="Любая страна"
            />
            <div className="col-span-full flex flex-wrap items-center justify-end gap-3 pt-1">
                <button
                    className="inline-flex h-11 items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 text-xs font-semibold uppercase tracking-[0.18em] text-stone-300 transition hover:bg-white/10 hover:text-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={!hasActiveFilters}
                    type="button"
                    onClick={() => router.push(pathname, { scroll: false })}
                >
                    Сбросить
                </button>
                <button
                    className="inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-[#f1c37d] to-[#bf8144] px-5 text-xs font-semibold uppercase tracking-[0.18em] text-[#1c160f] shadow-[0_14px_34px_rgba(191,129,68,0.22)] transition hover:brightness-105"
                    type="submit"
                >
                    Применить
                </button>
            </div>
        </form>
    );
}
