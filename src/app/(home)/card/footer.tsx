import React from "react";
import ReactCountryFlag from "react-country-flag";

import Link from "next/link";

import type { Item } from "@/models/types";

import { COUNTRY } from "./constants";

export default function Footer({
    name,
    notes,
    strength,
    user,
    countryOrigin,
    type,
}: {
    name: Item["name"];
    notes: Item["notes"];
    strength: Item["strength"];
    user: Item["user"];
    countryOrigin: Item["countryOrigin"];
    type: Item["type"];
}) {
    return (
        <>
            <h5 className="mb-2 w-full break-words text-center text-2xl font-semibold text-stone-100">
                {name}
            </h5>
            <ul className="flex w-full flex-col items-center gap-1 pb-4 text-center">
                <li className="w-full break-words text-sm text-stone-400">
                    <Link className="break-words" href={`/?type=${type}`}>
                        {type}
                    </Link>
                </li>
                <li className="w-full break-words text-sm text-stone-400">
                    <Link className="break-words" href={`/?strength=${strength}`}>
                        {strength} %
                    </Link>
                </li>
                <li className="w-full break-words text-sm text-stone-400">
                    <Link
                        className="break-words"
                        href={`/?countryOrigin=${countryOrigin}`}
                    >
                        {countryOrigin}{" "}
                        <ReactCountryFlag
                            countryCode={
                                //@ts-ignore
                                COUNTRY[countryOrigin] ?? ""
                            }
                        />
                    </Link>
                </li>
                <li className="w-full break-words text-sm text-stone-400">
                    <Link className="break-words" href={`/?user=${user}`}>
                        {user}
                    </Link>
                </li>
                <li className="w-full break-words px-3 pt-2 text-sm text-stone-500">
                    {notes}
                </li>
            </ul>
            {/* <div className="flex mt-4 space-x-3 md:mt-6">
                    <a
                        href="#"
                        className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-white bg-slate-700 rounded-lg hover:bg-slate-800 focus:ring-4 focus:outline-none focus:ring-emerald-300 dark:bg-slate-600 dark:hover:bg-slate-700 dark:focus:ring-emerald-800"
                    >
                        Add friend
                    </a>
                    <a
                        href="#"
                        className="inline-flex items-center py-2 px-4 text-sm font-medium text-center text-gray-900 bg-white rounded-lg border border-gray-300 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                    >
                        Message
                    </a>
                </div> */}
        </>
    );
}
