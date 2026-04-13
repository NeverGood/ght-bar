import React from "react";

import "./globals.css";
import type { Metadata } from "next";

import { Theme } from "@radix-ui/themes";

import Header from "@/components/header";
import SessionProviderComponent from "./session-provider";
import Toast from "@/components/toast";

export const metadata: Metadata = {
    title: "GHT Bar",
    // description: "",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-[#06070a] text-stone-100">
                <SessionProviderComponent>
                    <Theme appearance="dark" accentColor="amber" grayColor="sand">
                        <div className="flex flex-col min-h-full">
                            {/* @ts-ignore */}
                            <Header />
                            <div className="flex grow [&>*]:grow">
                                {children}
                            </div>
                        </div>
                    </Theme>
                </SessionProviderComponent>
                <Toast />
            </body>
        </html>
    );
}
