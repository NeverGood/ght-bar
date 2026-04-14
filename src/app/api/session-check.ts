import { authOptions, type AppSessionUser } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";

export const sessionCheck = async () => {
    const session = await getServerSession(authOptions);
    const currentUser = session?.user as AppSessionUser | undefined;

    if (!currentUser?.isAdmin) {
        return NextResponse.json(
            {
                message: `Please login`,
            },
            {
                status: 401,
            }
        );
    }
};
