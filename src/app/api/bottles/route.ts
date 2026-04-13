import { NextRequest, NextResponse } from "next/server";
import { getCatalogList } from "@/lib/bottle-catalog";

const handler = async (req: NextRequest) => {
    console.info("get bottles request from client component");

    const { searchParams } = new URL(req.url);
    const result = await getCatalogList({
        countryOrigin: searchParams.get("countryOrigin") || "",
        name: searchParams.get("name") || "",
        page: Number(searchParams.get("page") || 0),
        strength: searchParams.get("strength") || "",
        type: searchParams.get("type") || "",
        user: searchParams.get("user") || "",
    });

    return NextResponse.json(result, {
        status: 200,
    });
};

export { handler as GET };
