"use client";
import React, { useState } from "react";
import type { CatalogFilterOptions } from "@/lib/bottle-catalog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Form from "../filter-form";

export default function FilterController({
    filterOptions,
}: {
    filterOptions: CatalogFilterOptions;
}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isFilterOpen, setFilterOpen] = useState(true);
    const activeFilters = [
        searchParams.get("collection"),
        searchParams.get("type"),
        searchParams.get("strength"),
        searchParams.get("name"),
        searchParams.get("countryOrigin"),
        searchParams.get("user"),
    ].filter(Boolean).length;

    return (
        <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                    <p className="m-0 text-[0.7rem] uppercase tracking-[0.18em] text-[#d5a25c]">
                        Фильтры каталога
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-3">
                        <h3 className="m-0 text-lg font-semibold text-stone-100">
                            Подбор бутылок
                        </h3>
                        <button
                            className="rounded-full border border-white/7 bg-white/[0.03] px-3 py-1 text-xs text-stone-400 transition hover:border-white/12 hover:bg-white/[0.06] hover:text-stone-100"
                            type="button"
                            onClick={() => router.push(pathname, { scroll: false })}
                        >
                            Все бутылки
                        </button>
                    </div>
                </div>
                <button
                    className="inline-flex h-10 items-center justify-center rounded-full border border-white/7 bg-[#0b0e14] px-4 text-xs font-semibold uppercase tracking-[0.18em] text-stone-300 transition hover:bg-[#10141b] hover:text-stone-100"
                    type="button"
                    onClick={() => setFilterOpen((prev) => !prev)}
                >
                    {isFilterOpen ? "Скрыть" : "Показать"}
                </button>
            </div>
            <div className="border-t border-white/6 pt-4">
                <div
                    className={`overflow-hidden transition-all duration-300 ${
                        isFilterOpen ? "max-h-[720px]" : "max-h-0"
                    }`}
                >
                    <Form filterOptions={filterOptions} />
                </div>
            </div>
        </section>
    );
}
