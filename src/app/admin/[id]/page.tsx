import React from "react";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";

import { authOptions, prisma, type AppSessionUser } from "@/lib/auth";
import AccessShell from "@/components/access-shell";

import Form from "../form";
import ImageComponent from "@/app/(home)/card/image";

export default async function Admin({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions);
    const currentUser = session?.user as AppSessionUser | undefined;

    if (!session || !currentUser?.isAdmin) {
        redirect("/");
    }

    const bottle = await prisma.items.findFirst({
        where: {
            id: Number(params.id),
        },
    });

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
            panelTitle="Редактирование бутылки"
            title="ghT Mini Bar"
        >
            <div className="space-y-6">
                {bottle?.image && (
                    <div className="flex justify-center rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                        <ImageComponent
                            image={bottle?.image}
                            name={bottle?.name || ""}
                            className="h-48 w-48 rounded-[24px] object-cover"
                            height={280}
                            width={280}
                        />
                    </div>
                )}
                <Form item={bottle} users={usersArray} types={typesArray} />
            </div>
        </AccessShell>
    );
}
