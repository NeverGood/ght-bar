"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

import React from "react";

export default function SignOutButton() {
    const router = useRouter();

    const onSignOut = async () => {
        try {
            await signOut();

            router.refresh();
        } catch (e) {
            console.error("error", e);
        }
    };

    return (
        <div className="flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
            <a
                className="inline-flex h-11 cursor-pointer items-center px-3 text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                onMouseUp={onSignOut}
            >
                <>
                    <i className="fab fa-pinterest text-lg leading-lg text-white opacity-75"></i>
                    <span className="ml-2">LogOut</span>
                </>
            </a>
        </div>
    );
}
