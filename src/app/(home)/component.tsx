"use client";

import React from "react";
import { createPortal } from "react-dom";
import useSWRInfinite from "swr/infinite";

import type { Item } from "@/models/types";
import type { CatalogFilterOptions } from "@/lib/bottle-catalog";
import { useSearchParams } from "next/navigation";

import WhiskeyComponent from "@/components/whiskey";
import NextPageButton from "./next-page-button";
import Items from "./items";
import FilterController from "./filter-controller";

export const stateKey = "/api/bottles";

async function sendRequest(url: string) {
    const res = await fetch(url);

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

export default function Component({
    bottles,
    count: initialCount,
    filterOptions,
}: {
    bottles: Item[];
    count: number;
    filterOptions: CatalogFilterOptions;
}) {
    const searchParams = useSearchParams();
    const page = Number(searchParams.get("page")) || 0;
    const [isMounted, setIsMounted] = React.useState(false);
    const [isScrollTopVisible, setIsScrollTopVisible] = React.useState(false);

    React.useEffect(() => {
        setIsMounted(true);
    }, []);

    React.useEffect(() => {
        const toggleScrollTopButton = () => {
            setIsScrollTopVisible(window.scrollY > 900);
        };

        toggleScrollTopButton();
        window.addEventListener("scroll", toggleScrollTopButton, {
            passive: true,
        });

        return () =>
            window.removeEventListener("scroll", toggleScrollTopButton);
    }, []);

    const getKey = (pageIndex: number, previousPageData: string | any[]) => {
        //@ts-ignore
        if (previousPageData && !previousPageData?.items) return null;

        const params = new URLSearchParams(searchParams.toString());

        const page = Number(params.get("page"));
        if (!page || typeof page !== "number") {
            params.set("page", pageIndex.toString());
        } else {
            params.set("page", Number(page + pageIndex).toString());
        }

        return `/api/bottles/v2?${params.toString()}`; // ключ SWR
    };

    //изнаачально неправильно определяется идекс
    const { data, size, setSize, isValidating, isLoading, error } =
        useSWRInfinite(getKey, sendRequest, {
            fallbackData: [{ items: bottles }],
            revalidateOnMount: false,
            revalidateFirstPage: false,
        });

    const b = data ? [].concat(...data.map((it) => it.items)) : [];

    const update = () => setSize(size + 1);

    const count = data && data[0].count ? data[0].count : initialCount;
    const scrollToTop = () =>
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });

    const scrollTopButton =
        isMounted && isScrollTopVisible
            ? createPortal(
                  <button
                      aria-label="Вернуться вверх страницы"
                      className="fixed bottom-6 right-6 z-[55] inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/8 bg-[rgba(8,11,16,0.94)] text-2xl text-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.38)] backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-[rgba(12,15,21,0.98)] focus:outline-none focus:ring-2 focus:ring-[#d5a25c]/25"
                      type="button"
                      onClick={scrollToTop}
                  >
                      ↑
                  </button>,
                  document.body
              )
            : null;

    return (
        <section className="flex flex-col gap-8">
            <div
                className="rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(17,20,27,0.96),rgba(11,13,18,0.94))] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.34)] backdrop-blur md:p-5"
                id="catalog-tools"
            >
                <FilterController filterOptions={filterOptions} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[24px] border border-white/8 bg-[#0b0e14]/88 px-5 py-4 text-sm text-stone-300 shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
                <p className="m-0">
                    В каталоге:{" "}
                    <span className="font-semibold text-stone-100">
                        {count}
                    </span>
                </p>
                <p className="m-0 text-stone-400">
                    Подгрузка продолжается по мере прокрутки страницы.
                </p>
            </div>
            <div className="w-full">
                {error ? (
                    <div className="flex flex-col items-center content-around justify-center rounded-[28px] border border-rose-500/30 bg-rose-500/10 px-8 py-12 text-center">
                        <WhiskeyComponent />
                        <h3 className="font-bold text-stone-100">Error</h3>
                    </div>
                ) : (
                    <Items bottles={b} />
                )}
            </div>
            {(page + size) * 20 < count && (
                <NextPageButton
                    isLoading={isLoading || isValidating}
                    update={update}
                />
            )}
            {scrollTopButton}
        </section>
    );
}
