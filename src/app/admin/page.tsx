import React from "react";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions, prisma, type AppSessionUser } from "@/lib/auth";
import AccessShell from "@/components/access-shell";

import Form from "./form";

export default async function Admin() {
    const session = await getServerSession(authOptions);
    const currentUser = session?.user as AppSessionUser | undefined;

    if (!session || !currentUser?.isAdmin) {
        redirect("/");
    }

    const users = await prisma.users.findMany({ select: { username: true } });
    const usersArray = users
        ?.map((user) => user.username)
        ?.filter((user) => user !== "admin");

    const types = await prisma.types.findMany({ select: { type: true } });
    const typesArray = types?.map((type) => type.type);

    return (
        <AccessShell
            eyebrow="private access"
            panelEyebrow="admin"
            panelTitle="Добавление бутылки"
            title="ghT Mini Bar"
        >
            <Form users={usersArray} types={typesArray} />
        </AccessShell>
    );
}
