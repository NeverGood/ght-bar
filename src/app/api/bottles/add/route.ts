import { prisma } from "@/lib/auth";

import { writeFile } from "fs/promises";
import path from "path";

import { NextResponse, type NextRequest } from "next/server";

import { sessionCheck } from "../../session-check";

// export const config = {
//     api: {
//         bodyParser: false,
//     },
// };

const handler = async (req: NextRequest) => {
    try {
        await sessionCheck();

        const uploadDir = path.join(process.cwd(), "/public/images");

        const data = await req.formData();

        const name = data.get("name") as string;
        const type = data.get("type") as string;
        const strength = data.get("strength") as string;
        const countryOrigin = data.get("countryOrigin") as string;
        const user = data.get("user") as string;
        const file: File | null = data.get("image") as unknown as File;
        const now = new Date();

        if (file) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            await writeFile(`${uploadDir}/${file.name}`, buffer);
        }

        await prisma.items.create({
            data: {
                countryOrigin,
                createdAt: now,
                image: file?.name ?? "",
                name,
                notes: "",
                strength: Number(strength),
                type,
                updatedAt: now,
                user,
            },
        });

        return NextResponse.json(
            {
                message: `Item has created`,
            },
            {
                status: 200,
            }
        );
    } catch (e) {
        console.log(e);
    }

    return NextResponse.json(
        {
            message: `Cant create item`,
        },
        {
            status: 400,
        }
    );
};

export { handler as POST };
