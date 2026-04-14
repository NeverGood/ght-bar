"use client";

import React from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SignButton() {
    const pathname = usePathname();

    const isLoginPage = pathname === "/login";
    const isSignupPage = pathname === "/signup";

    const linkClassName =
        "inline-flex h-11 items-center px-3 text-xs uppercase font-bold leading-snug text-white hover:opacity-75";

    const wrapperClassName =
        "flex items-center px-3 py-2 text-xs uppercase font-bold leading-snug text-white hover:opacity-75";

    return (
        <>
            {!isLoginPage && (
                <li className="nav-item cursor-pointer">
                    <div className={wrapperClassName}>
                        <Link className={linkClassName} href="/login">
                            <span className="ml-2">Sign In</span>
                        </Link>
                    </div>
                </li>
            )}
            {!isSignupPage && (
                <li className="nav-item cursor-pointer">
                    <div className={wrapperClassName}>
                        <Link className={linkClassName} href="/signup">
                            <span className="ml-2">Sign Up</span>
                        </Link>
                    </div>
                </li>
            )}
        </>
    );
}
