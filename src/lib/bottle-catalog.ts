import { prisma } from "@/lib/auth";
import type { Item } from "@/models/types";

type SearchParamsLike = {
    strength?: string;
    name?: string;
    countryOrigin?: string;
    user?: string;
    type?: string;
    page?: string | number;
};

export type CatalogFilterOptions = {
    countries: string[];
    strengths: string[];
    types: string[];
    users: string[];
};

export type CatalogOverview = {
    totalCountries: number;
    totalItems: number;
    totalTypes: number;
    totalUsers: number;
};

export type HeroBottle = Pick<
    Item,
    "countryOrigin" | "id" | "image" | "name" | "type"
>;

const MOCK_BOTTLES: Item[] = [
    {
        code_iso: "GB",
        countryOrigin: "Scotland",
        createdAt: "2026-01-10T00:00:00.000Z",
        id: 1001,
        image: "",
        name: "Nocturne Reserve",
        notes: "Smoky single malt with an amber finish.",
        strength: 46,
        type: "Whisky",
        updatedAt: "2026-01-10T00:00:00.000Z",
        user: "Nick",
    },
    {
        code_iso: "JM",
        countryOrigin: "Jamaica",
        createdAt: "2026-01-12T00:00:00.000Z",
        id: 1002,
        image: "",
        name: "Velvet Cask",
        notes: "Dark rum with vanilla and toasted sugar notes.",
        strength: 40,
        type: "Rum",
        updatedAt: "2026-01-12T00:00:00.000Z",
        user: "Nick",
    },
    {
        code_iso: "JP",
        countryOrigin: "Japan",
        createdAt: "2026-01-14T00:00:00.000Z",
        id: 1003,
        image: "",
        name: "Midnight Bloom",
        notes: "Elegant gin with citrus botanicals and dry finish.",
        strength: 43,
        type: "Gin",
        updatedAt: "2026-01-14T00:00:00.000Z",
        user: "Guest Shelf",
    },
    {
        code_iso: "FR",
        countryOrigin: "France",
        createdAt: "2026-01-16T00:00:00.000Z",
        id: 1004,
        image: "",
        name: "Maison Or",
        notes: "Collector cognac reserved for special tastings.",
        strength: 40,
        type: "Cognac",
        updatedAt: "2026-01-16T00:00:00.000Z",
        user: "Nick",
    },
    {
        code_iso: "MX",
        countryOrigin: "Mexico",
        createdAt: "2026-01-18T00:00:00.000Z",
        id: 1005,
        image: "",
        name: "Agave Sombra",
        notes: "Bright agave profile with peppery finish.",
        strength: 38,
        type: "Tequila",
        updatedAt: "2026-01-18T00:00:00.000Z",
        user: "Bar Room",
    },
    {
        code_iso: "IE",
        countryOrigin: "Ireland",
        createdAt: "2026-01-20T00:00:00.000Z",
        id: 1006,
        image: "",
        name: "Oakline Twelve",
        notes: "Soft triple-distilled whiskey for the front shelf.",
        strength: 42,
        type: "Whiskey",
        updatedAt: "2026-01-20T00:00:00.000Z",
        user: "Nick",
    },
    {
        code_iso: "IT",
        countryOrigin: "Italy",
        createdAt: "2026-01-21T00:00:00.000Z",
        id: 1007,
        image: "",
        name: "Aperitivo Nero",
        notes: "Bitter citrus aperitif in a dramatic matte bottle.",
        strength: 22,
        type: "Aperitif",
        updatedAt: "2026-01-21T00:00:00.000Z",
        user: "Guest Shelf",
    },
    {
        code_iso: "US",
        countryOrigin: "USA",
        createdAt: "2026-01-22T00:00:00.000Z",
        id: 1008,
        image: "",
        name: "Black Oak Batch",
        notes: "Small-batch bourbon with cocoa and oak aroma.",
        strength: 47,
        type: "Bourbon",
        updatedAt: "2026-01-22T00:00:00.000Z",
        user: "Nick",
    },
];

function containsValue(source: string | null, query: string | undefined) {
    if (!query) {
        return true;
    }

    return (source || "").toLowerCase().includes(query.toLowerCase());
}

function uniqueSorted(values: Array<string | number | null | undefined>) {
    return Array.from(
        new Set(
            values
                .map((value) =>
                    typeof value === "number" ? value.toString() : value?.trim()
                )
                .filter(Boolean) as string[]
        )
    ).sort((left, right) =>
        left.localeCompare(right, undefined, { numeric: true })
    );
}

function filterMockBottles(searchParams: SearchParamsLike) {
    return MOCK_BOTTLES.filter((item) => {
        const strength = searchParams.strength
            ? Number(searchParams.strength)
            : null;

        return (
            (strength ? item.strength === strength : true) &&
            containsValue(item.name, searchParams.name) &&
            containsValue(item.countryOrigin, searchParams.countryOrigin) &&
            containsValue(item.user, searchParams.user) &&
            containsValue(item.type, searchParams.type)
        );
    });
}

function buildWhere(searchParams: SearchParamsLike) {
    const strength = searchParams.strength;
    const name = searchParams.name;
    const countryOrigin = searchParams.countryOrigin;
    const user = searchParams.user;
    const type = searchParams.type;

    return {
        ...(strength ? { strength: Number(strength) } : {}),
        ...(name ? { name: { contains: name } } : {}),
        ...(countryOrigin
            ? { countryOrigin: { contains: countryOrigin } }
            : {}),
        ...(user ? { user: { contains: user } } : {}),
        ...(type ? { type: { contains: type } } : {}),
    };
}

export async function getCatalogPage(
    searchParams: SearchParamsLike,
    pageSize = 20
) {
    const page = Number(searchParams.page || 0);
    const where = buildWhere(searchParams);

    try {
        const count = await prisma.items.count({ where });
        const items = await prisma.items.findMany({
            where,
            skip: page * pageSize,
            take: pageSize,
        });

        return { count, items };
    } catch {
        const filtered = filterMockBottles(searchParams);

        return {
            count: filtered.length,
            items: filtered.slice(page * pageSize, (page + 1) * pageSize),
        };
    }
}

export async function getCatalogList(searchParams: SearchParamsLike) {
    const page = Number(searchParams.page || 0);
    const where = buildWhere(searchParams);

    try {
        let take = 20;

        if (page) {
            take = (page + 1) * 20;
        }

        return await prisma.items.findMany({
            where,
            take,
        });
    } catch {
        const filtered = filterMockBottles(searchParams);

        if (page) {
            return filtered.slice(0, (page + 1) * 20);
        }

        return filtered.slice(0, 20);
    }
}

export async function getCatalogFilterOptions(): Promise<CatalogFilterOptions> {
    try {
        const [types, countries, users, strengths] = await Promise.all([
            prisma.items.findMany({
                distinct: ["type"],
                select: { type: true },
                where: { type: { not: null } },
            }),
            prisma.items.findMany({
                distinct: ["countryOrigin"],
                select: { countryOrigin: true },
                where: { countryOrigin: { not: null } },
            }),
            prisma.items.findMany({
                distinct: ["user"],
                select: { user: true },
                where: { user: { not: null } },
            }),
            prisma.items.findMany({
                distinct: ["strength"],
                select: { strength: true },
                where: { strength: { not: null } },
            }),
        ]);

        return {
            countries: uniqueSorted(countries.map((item) => item.countryOrigin)),
            strengths: uniqueSorted(strengths.map((item) => item.strength)),
            types: uniqueSorted(types.map((item) => item.type)),
            users: uniqueSorted(users.map((item) => item.user)),
        };
    } catch {
        return {
            countries: uniqueSorted(
                MOCK_BOTTLES.map((item) => item.countryOrigin)
            ),
            strengths: uniqueSorted(MOCK_BOTTLES.map((item) => item.strength)),
            types: uniqueSorted(MOCK_BOTTLES.map((item) => item.type)),
            users: uniqueSorted(MOCK_BOTTLES.map((item) => item.user)),
        };
    }
}

export async function getCatalogOverview(): Promise<CatalogOverview> {
    try {
        const [totalItems, filterOptions] = await Promise.all([
            prisma.items.count(),
            getCatalogFilterOptions(),
        ]);

        return {
            totalCountries: filterOptions.countries.length,
            totalItems,
            totalTypes: filterOptions.types.length,
            totalUsers: filterOptions.users.length,
        };
    } catch {
        const countries = uniqueSorted(MOCK_BOTTLES.map((item) => item.countryOrigin));
        const types = uniqueSorted(MOCK_BOTTLES.map((item) => item.type));
        const users = uniqueSorted(MOCK_BOTTLES.map((item) => item.user));

        return {
            totalCountries: countries.length,
            totalItems: MOCK_BOTTLES.length,
            totalTypes: types.length,
            totalUsers: users.length,
        };
    }
}

export async function getHeroBottles(): Promise<HeroBottle[]> {
    try {
        const items = await prisma.items.findMany({
            where: {
                image: {
                    not: "",
                },
            },
            orderBy: {
                id: "asc",
            },
            take: 4,
            select: {
                countryOrigin: true,
                id: true,
                image: true,
                name: true,
                type: true,
            },
        });

        if (items.length > 0) {
            return items;
        }
    } catch {}

    return MOCK_BOTTLES.slice(0, 4).map((item) => ({
        countryOrigin: item.countryOrigin,
        id: item.id,
        image: item.image,
        name: item.name,
        type: item.type,
    }));
}
