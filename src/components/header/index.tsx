import React from "react";

import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions, type AppSessionUser } from "@/lib/auth";

import SignOutButton from "./sign-out-button";
import SignButton from "./sign-button";

export default async function Header() {
    const session = await getServerSession(authOptions);
    const currentUser = session?.user as AppSessionUser | undefined;

    return (
        <header className="w-full px-3 pt-3">
            <div className="mx-auto w-full max-w-[1180px]">
                <nav className="relative mb-3 flex flex-wrap items-center justify-between rounded-[26px] border border-white/8 bg-[rgba(8,11,16,0.92)] px-2 py-3 shadow-[0_24px_60px_rgba(0,0,0,0.38)] backdrop-blur">
                    <div className="container mx-auto flex flex-row flex-wrap items-center justify-between px-4">
                        <div className="relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
                            <Link
                                className="mr-4 inline-block whitespace-nowrap py-2 text-sm font-bold leading-relaxed tracking-[0.08em] text-[#f6f0e6]"
                                href="/"
                            >
                                ghT Mini Bar
                            </Link>
                        </div>
                        <div
                            className={"flex-row items-center" + "flex"}
                            id="example-navbar-danger"
                        >
                            <ul
                                className="flex flex-row items-center gap-1 list-none lg:ml-auto"
                            >
                                {/* <li className="nav-item">
                                    <a
                                        className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                                        href="#pablo"
                                    >
                                        <i className="fab fa-facebook-square text-lg leading-lg text-white opacity-75"></i>
                                        <span className="ml-2">Share</span>
                                    </a>
                                </li>
                                <li className="nav-item">
                                    <a
                                        className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                                        href="#pablo"
                                    >
                                        <i className="fab fa-twitter text-lg leading-lg text-white opacity-75"></i>
                                        <span className="ml-2">Tweet</span>
                                    </a>
                                </li> */}
                                {!session && <SignButton />}
                                {session && (
                                    <>
                                        <li className="nav-item">
                                            <div className="inline-flex h-11 min-w-[96px] items-center justify-center rounded-full border border-white/8 bg-white/[0.04] px-4 text-xs font-semibold uppercase tracking-[0.14em] text-stone-300">
                                                {currentUser?.username}
                                            </div>
                                        </li>
                                        {currentUser?.isAdmin && (
                                                <li className="nav-item cursor-pointer">
                                                    <div className="flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
                                                        <Link
                                                            className="inline-flex h-11 items-center px-3 text-xs font-bold uppercase leading-snug text-white hover:opacity-75"
                                                            href={`/admin`}
                                                        >
                                                            <>
                                                                <i className="fab fa-pinterest text-lg leading-lg text-white opacity-75"></i>
                                                                <span className="ml-2">
                                                                    Admin
                                                                </span>
                                                            </>
                                                        </Link>
                                                    </div>
                                                </li>
                                        )}
                                        {/* <li className="nav-item cursor-pointer">
                                            <div className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75">
                                                <Link
                                                    className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                                                    href={`/profile/${session?.user?.username}`}
                                                >
                                                    <>
                                                        <i className="fab fa-pinterest text-lg leading-lg text-white opacity-75"></i>
                                                        <span className="ml-2">
                                                            Profile
                                                        </span>
                                                    </>
                                                </Link>
                                            </div>
                                        </li> */}
                                        <li className="nav-item">
                                            <SignOutButton />
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </header>
    );
}
