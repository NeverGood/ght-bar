/* eslint-disable sort-keys */
import bCrypt from "bcrypt";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

export type AppSessionUser = {
    id?: string;
    isAdmin?: boolean | null;
    mail?: string | null;
    username?: string | null;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {
                password: { label: "Password", type: "password" },
                username: { label: "Username", type: "text" },
            },
            authorize: async (credentials) => {
                const username = credentials?.username ?? "";
                const password = credentials?.password ?? "";

                let isLoggedIn = false;
                let user = null;

                if (username && password) {
                    try {
                        user = await prisma.users.findFirst({
                            where: { username },
                        });

                        const passwordMatch = await bCrypt.compareSync(
                            password,
                            user?.password ?? ""
                        );

                        isLoggedIn = passwordMatch;
                    } catch (e) {
                        console.error("error", e);
                    }
                }

                if (isLoggedIn) {
                    return {
                        id: user?.id?.toString() ?? "",
                        username: user?.username,
                        mail: user?.mail,
                        isAdmin: user?.isAdmin,
                    };
                } else {
                    return null;
                }
            },
        }),
    ],
    secret: process.env.NEXT_PUBLIC_SECRET,
    callbacks: {
        async session({ session, token }: { session: any; token: any }) {
            session.user = token.user;
            return session;
        },

        async jwt({ token, user }: { token: any; user: any }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
    },

    pages: {
        signIn: "/login",
    },
};
