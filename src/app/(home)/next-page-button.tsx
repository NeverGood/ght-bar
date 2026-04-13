"use client";

import { debounce } from "lodash-es";
import React from "react";

export default function NextPageButton({
    isLoading = false,
    update,
}: {
    isLoading: boolean;
    update: any;
}) {
    const observerTarget = React.useRef(null);

    const addMoreItems = debounce(() => {
        const current = new URLSearchParams(window.location.search);
        const page = current.get("page");

        if (Number(page)) {
            current.delete("page");
            current.set("page", (Number(page) + 1).toString());
        } else {
            current.set("page", "1");
        }

        const search = current.toString();

        const query = search ? `?${search}` : "";
        // window.history.pushState({}, "", query ? query : "/");

        window.history.replaceState(
            { ...window.history.state, as: query, url: query },
            "",
            query
        );

        update();
    }, 300);

    React.useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    !isLoading && addMoreItems();
                }
            },
            { threshold: 0 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => {
            if (observerTarget.current) {
                observer.unobserve(observerTarget.current);
            }
        };
    }, [observerTarget, isLoading]);

    return (
        <div className="group flex w-full justify-center rounded-full border border-[#d5a25c]/20 bg-[#121720] py-3 px-4 text-sm font-medium uppercase tracking-[0.2em] text-stone-200 transition hover:bg-[#181f2b] focus:outline-none">
            {!isLoading ? (
                <p key="ref" ref={observerTarget}>
                    ...
                </p>
            ) : (
                <p key="loading">loading...</p>
            )}
        </div>
    );
}
