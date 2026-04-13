"use client";

import React, { useState } from "react";

import { useSession } from "next-auth/react";
// import { useRouter } from "next/navigation";

import type { Item } from "@/models/types";

import DeleteDialog from "./dialog";

export default function Header({ id }: { id: Item["id"] }) {
    const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
    const toggleSettings = () => setIsSettingsOpen((prev) => !prev);
    const { data: session } = useSession();
    // const router = useRouter();

    // const [isDeleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    // const toggleDeleteDialog = () => setDeleteDialogOpen((prev) => !prev);

    return (
        <>
            <div className="flex justify-end px-4 pt-4" data-card-action>
                <button
                    className="inline-block rounded-full p-2 text-stone-400 transition hover:bg-white/5 hover:text-stone-100 focus:outline-none focus:ring-2 focus:ring-[#d5a25c]/40"
                    data-dropdown-toggle="dropdown"
                    id="dropdownButton"
                    type="button"
                    onMouseDown={toggleSettings}
                >
                    <span className="sr-only">Open dropdown</span>
                    <svg
                        aria-hidden="true"
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
                    </svg>
                </button>
                {
                    //@ts-ignore
                    session && session?.user?.isAdmin && (
                        <div
                            className={`${
                                !isSettingsOpen ? "hidden" : ""
                            } absolute right-16 z-10 w-44 list-none divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#141922] text-base shadow-[0_24px_60px_rgba(0,0,0,0.4)]`}
                            data-card-action
                            id="dropdown"
                        >
                            <ul
                                aria-labelledby="dropdownButton"
                                className="py-1"
                            >
                                <li>
                                    <a
                                        className="block px-4 py-2 text-sm text-stone-200 transition hover:bg-white/5"
                                        href={`/admin/${id}`}
                                    >
                                        Edit
                                    </a>
                                </li>

                                <li>
                                    {/* <a
                                        className="block py-2 px-4 p-0 text-sm text-red-600 hover:bg-gray-100 "
                                        href="#"
                                        // onMouseUp={async (e) => {
                                        //     e.preventDefault();

                                        //     // toggleDeleteDialog();
                                        //     // const isDelete = confirm(
                                        //     //     "Ты что, собрался удалить эту хрень?"
                                        //     // );

                                        //     // if (isDelete) {
                                        //     //     try {
                                        //     //         await fetch(
                                        //     //             `/api/bottles/${id}`,
                                        //     //             {
                                        //     //                 method: "DELETE",
                                        //     //             }
                                        //     //         );

                                        //     //         router.push("/");
                                        //     //     } catch {
                                        //     //         console.error("error");
                                        //     //     }
                                        //     // }
                                        // }}
                                    > */}
                                    {/* Delete
                                     */}
                                    <DeleteDialog id={id} />
                                    {/* </a> */}
                                </li>
                            </ul>
                        </div>
                    )
                }
            </div>
            {/* <DeleteDialog isOpen={isDeleteDialogOpen} /> */}
        </>
    );
}
