import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/auth";
import type { Item } from "@/models/types";

type SearchParamsLike = {
    collection?: string;
    strength?: string;
    name?: string;
    countryOrigin?: string;
    user?: string;
    type?: string;
    page?: string | number;
};

type CatalogSourceItem = {
    code_iso?: null | string;
    collection?: null | string;
    countryOrigin?: null | string;
    createdAt?: Date | null | string;
    id?: null | number;
    image?: null | string;
    name?: null | string;
    notes?: null | string;
    strength?: null | number;
    type?: null | string;
    updatedAt?: Date | null | string;
    user?: null | string;
};

export type CatalogFilterOptions = {
    collections: string[];
    countries: string[];
    strengths: string[];
    types: string[];
    users: string[];
};

export type CatalogOverview = {
    totalCollections: number;
    totalCountries: number;
    totalItems: number;
    totalTypes: number;
    totalUsers: number;
};

export type HeroBottle = {
    countryOrigin: string;
    id: number;
    image: string;
    name: string;
    type: string;
};

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

const mockCatalogFallbackEnabled =
    process.env.ALLOW_MOCK_CATALOG_FALLBACK === "true" ||
    process.env.NODE_ENV !== "production";

const COLLECTION_STOP_WORDS = new Set([
    "a",
    "an",
    "black",
    "don",
    "el",
    "grand",
    "grey",
    "jack",
    "jim",
    "jose",
    "old",
    "padre",
    "paul",
    "power",
    "remy",
    "sangre",
    "old",
    "the",
]);

const COLLECTION_CONNECTOR_WORDS = new Set([
    "de",
    "del",
    "di",
    "for",
    "l'",
    "la",
    "le",
    "of",
]);

function rethrowCatalogError(context: string, error: unknown) {
    console.error(`[catalog] ${context} failed`, error);

    if (!mockCatalogFallbackEnabled) {
        throw error instanceof Error
            ? error
            : new Error(`[catalog] ${context} failed`);
    }
}

function containsValue(
    source: string | null | undefined,
    query: string | undefined
) {
    if (!query) {
        return true;
    }

    return (source || "").toLowerCase().includes(query.toLowerCase());
}

function normalizeCatalogItem(item: CatalogSourceItem): Item {
    return {
        code_iso: item.code_iso || "",
        collection: item.collection || null,
        countryOrigin: item.countryOrigin || "",
        createdAt:
            item.createdAt instanceof Date
                ? item.createdAt.toISOString()
                : item.createdAt || new Date(0).toISOString(),
        id: Number(item.id || 0),
        image: item.image || "",
        name: item.name || "",
        notes: item.notes || null,
        strength: Number(item.strength || 0),
        type: item.type || "",
        updatedAt:
            item.updatedAt instanceof Date
                ? item.updatedAt.toISOString()
                : item.updatedAt || new Date(0).toISOString(),
        user: item.user || "",
    };
}

function tokenizeCollectionName(name: string | null | undefined) {
    return (name || "")
        .split(/\s+/)
        .map((token) => token.trim())
        .filter(Boolean);
}

function buildCollectionPrefixCounts(items: CatalogSourceItem[]) {
    const prefixCounts = new Map<string, number>();

    for (const item of items) {
        const tokens = tokenizeCollectionName(item.name);

        for (let length = 1; length <= Math.min(4, tokens.length); length++) {
            const prefix = tokens.slice(0, length).join(" ").trim();

            if (!prefix || /[0-9]$/.test(prefix)) {
                continue;
            }

            prefixCounts.set(prefix, (prefixCounts.get(prefix) || 0) + 1);
        }
    }

    return prefixCounts;
}

function deriveCollectionName(
    name: string | null | undefined,
    prefixCounts: Map<string, number>
) {
    const tokens = tokenizeCollectionName(name);

    if (!tokens.length) {
        return null;
    }

    const candidates: Array<{
        count: number;
        endsWithConnector: boolean;
        prefix: string;
        tokenCount: number;
    }> = [];

    for (let length = 1; length <= Math.min(4, tokens.length); length++) {
        const prefix = tokens.slice(0, length).join(" ").trim();
        const count = prefixCounts.get(prefix) || 0;

        if (count < 2) {
            continue;
        }

        if (length === 1 && COLLECTION_STOP_WORDS.has(prefix.toLowerCase())) {
            continue;
        }

        const lastToken = tokens[length - 1].toLowerCase();

        candidates.push({
            count,
            endsWithConnector: COLLECTION_CONNECTOR_WORDS.has(lastToken),
            prefix,
            tokenCount: length,
        });
    }

    if (!candidates.length) {
        return null;
    }

    const validCandidates = candidates.filter((candidate) => !candidate.endsWithConnector);
    const rankedCandidates = validCandidates.length ? validCandidates : candidates;

    const firstToken = tokens[0]?.toLowerCase() || "";
    const nonGenericSingleWord = rankedCandidates.find(
        (candidate) =>
            candidate.tokenCount === 1 &&
            !COLLECTION_STOP_WORDS.has(firstToken)
    );

    if (nonGenericSingleWord) {
        return nonGenericSingleWord.prefix;
    }

    rankedCandidates.sort((left, right) => {
        if (left.tokenCount !== right.tokenCount) {
            return left.tokenCount - right.tokenCount;
        }

        if (right.count !== left.count) {
            return right.count - left.count;
        }

        return left.prefix.length - right.prefix.length;
    });

    return rankedCandidates[0].prefix;
}

function decorateItemsWithCollections(items: CatalogSourceItem[]): Item[] {
    const normalizedItems = items.map(normalizeCatalogItem);
    const prefixCounts = buildCollectionPrefixCounts(normalizedItems);

    return normalizedItems.map((item) => ({
        ...item,
        collection: deriveCollectionName(item.name, prefixCounts),
    }));
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
    const items = decorateItemsWithCollections(MOCK_BOTTLES);

    return filterCatalogItems(items, searchParams);
}

function filterCatalogItems(items: Item[], searchParams: SearchParamsLike) {
    return items.filter((item) => {
        const strength = searchParams.strength
            ? Number(searchParams.strength)
            : null;

        return (
            containsValue(item.collection, searchParams.collection) &&
            (strength ? item.strength === strength : true) &&
            containsValue(item.name, searchParams.name) &&
            containsValue(item.countryOrigin, searchParams.countryOrigin) &&
            containsValue(item.user, searchParams.user) &&
            containsValue(item.type, searchParams.type)
        );
    });
}

const getCatalogSnapshot = unstable_cache(
    async (): Promise<Item[]> =>
        decorateItemsWithCollections(
            await prisma.items.findMany({
                orderBy: {
                    id: "asc",
                },
            })
        ),
    ["catalog-snapshot"],
    {
        revalidate: 30,
    }
);

export async function getCatalogPage(
    searchParams: SearchParamsLike,
    pageSize = 20
) {
    const page = Number(searchParams.page || 0);

    try {
        const filtered = filterCatalogItems(
            await getCatalogSnapshot(),
            searchParams
        );

        return {
            count: filtered.length,
            items: filtered.slice(page * pageSize, (page + 1) * pageSize),
        };
    } catch (error) {
        rethrowCatalogError("getCatalogPage", error);

        const filtered = filterMockBottles(searchParams);

        return {
            count: filtered.length,
            items: filtered.slice(page * pageSize, (page + 1) * pageSize),
        };
    }
}

export async function getCatalogList(searchParams: SearchParamsLike) {
    const page = Number(searchParams.page || 0);

    try {
        const filtered = filterCatalogItems(
            await getCatalogSnapshot(),
            searchParams
        );

        if (page) {
            return filtered.slice(0, (page + 1) * 20);
        }

        return filtered.slice(0, 20);
    } catch (error) {
        rethrowCatalogError("getCatalogList", error);

        const filtered = filterMockBottles(searchParams);

        if (page) {
            return filtered.slice(0, (page + 1) * 20);
        }

        return filtered.slice(0, 20);
    }
}

export async function getCatalogFilterOptions(): Promise<CatalogFilterOptions> {
    try {
        const items = await getCatalogSnapshot();

        return {
            collections: uniqueSorted(items.map((item) => item.collection)),
            countries: uniqueSorted(items.map((item) => item.countryOrigin)),
            strengths: uniqueSorted(items.map((item) => item.strength)),
            types: uniqueSorted(items.map((item) => item.type)),
            users: uniqueSorted(items.map((item) => item.user)),
        };
    } catch (error) {
        rethrowCatalogError("getCatalogFilterOptions", error);

        const items = decorateItemsWithCollections(MOCK_BOTTLES);

        return {
            collections: uniqueSorted(items.map((item) => item.collection)),
            countries: uniqueSorted(items.map((item) => item.countryOrigin)),
            strengths: uniqueSorted(items.map((item) => item.strength)),
            types: uniqueSorted(items.map((item) => item.type)),
            users: uniqueSorted(items.map((item) => item.user)),
        };
    }
}

export async function getCatalogOverview(): Promise<CatalogOverview> {
    try {
        const items = await getCatalogSnapshot();
        const filterOptions = {
            collections: uniqueSorted(items.map((item) => item.collection)),
            countries: uniqueSorted(items.map((item) => item.countryOrigin)),
            types: uniqueSorted(items.map((item) => item.type)),
            users: uniqueSorted(items.map((item) => item.user)),
        };

        return {
            totalCollections: filterOptions.collections.length,
            totalCountries: filterOptions.countries.length,
            totalItems: items.length,
            totalTypes: filterOptions.types.length,
            totalUsers: filterOptions.users.length,
        };
    } catch (error) {
        rethrowCatalogError("getCatalogOverview", error);

        const items = decorateItemsWithCollections(MOCK_BOTTLES);
        const countries = uniqueSorted(MOCK_BOTTLES.map((item) => item.countryOrigin));
        const types = uniqueSorted(MOCK_BOTTLES.map((item) => item.type));
        const users = uniqueSorted(MOCK_BOTTLES.map((item) => item.user));

        return {
            totalCollections: uniqueSorted(items.map((item) => item.collection))
                .length,
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
            return items.map((item) => ({
                countryOrigin: item.countryOrigin || "",
                id: item.id,
                image: item.image || "",
                name: item.name || "",
                type: item.type || "",
            }));
        }
    } catch (error) {
        rethrowCatalogError("getHeroBottles", error);
    }

    return MOCK_BOTTLES.slice(0, 4).map((item) => ({
        countryOrigin: item.countryOrigin,
        id: item.id,
        image: item.image,
        name: item.name,
        type: item.type,
    }));
}
