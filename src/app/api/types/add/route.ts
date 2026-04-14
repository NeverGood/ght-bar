import { NextResponse, type NextRequest } from "next/server";

import { prisma } from "@/lib/auth";
import { sessionCheck } from "@/app/api/session-check";

export const POST = async (req: NextRequest) => {
    try {
        const unauthorizedResponse = await sessionCheck();

        if (unauthorizedResponse) {
            return unauthorizedResponse;
        }

        const data = await req.formData();
        const rawType = data.get("type");
        const type = typeof rawType === "string" ? rawType.trim() : "";

        if (!type) {
            return NextResponse.json(
                {
                    message: "Введите название нового типа",
                },
                {
                    status: 400,
                }
            );
        }

        const existingType = await prisma.types.findFirst({
            where: { type },
        });

        if (existingType) {
            return NextResponse.json(
                {
                    message: "Такой тип уже существует",
                    type: existingType.type,
                },
                {
                    status: 200,
                }
            );
        }

        const now = new Date();
        const createdType = await prisma.types.create({
            data: {
                createdAt: now,
                type,
                updatedAt: now,
            },
        });

        return NextResponse.json(
            {
                message: "Новый тип добавлен",
                type: createdType.type,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.error(error);

        return NextResponse.json(
            {
                message: "Не удалось добавить новый тип",
            },
            {
                status: 400,
            }
        );
    }
};
