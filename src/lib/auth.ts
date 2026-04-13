/* eslint-disable sort-keys */
import bCrypt from "bcrypt";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma?: PrismaClient;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            //@ts-ignore
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
                    // Any object returned will be saved in `user` property of the JWT
                    return {
                        username: user?.username,
                        mail: user?.mail,
                        isAdmin: user?.isAdmin,
                    };
                } else {
                    // If you return null then an error will be displayed advising the user to check their details.
                    return null;

                    // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
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
        // signIn
        signIn: "/login", //Need to define custom login page (if using)
        admin: "/admin",
    },
};
