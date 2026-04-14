//@ts-ignore
import { cache } from "react";
import styles from "./Home.module.css";
import { Metadata } from "next";
import Image from "next/image";
import Component from "./component";
import {
    getCatalogFilterOptions,
    getCatalogOverview,
    getCatalogPage,
} from "@/lib/bottle-catalog";

export const metadata: Metadata = {
    title: "ghT Mini Bar",
    description: "Каталог коллекции бутылок с алкоголем в тёмной теме.",
};

const getBottles = cache(async (searchParams: any) => getCatalogPage(searchParams));

export default async function Home({ searchParams }: any) {
    const bottles: any = await getBottles(searchParams);
    const [filterOptions, overview] = await Promise.all([
        getCatalogFilterOptions(),
        getCatalogOverview(),
    ]);

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <div className={styles.heroCopy}>
                    <p className={styles.eyebrow}>Private collection catalog</p>
                    <h1 className={styles.heroTitle}>ghT Mini Bar</h1>
                    <p className={styles.heroText}>
                        Здесь представлена моя личная коллекция миниатюр
                        алкоголя со всего мира, который на протяжении многих
                        лет я приобретаю сам или мне дарят мои друзья.
                    </p>
                    <div className={styles.heroActions}>
                        <a className={styles.primaryAction} href="#catalog">
                            Смотреть каталог
                        </a>
                        <a
                            className={styles.secondaryAction}
                            href="#catalog-tools"
                        >
                            Открыть фильтры
                        </a>
                    </div>
                </div>

                <div className={styles.heroVisual} aria-hidden="true">
                    <div className={styles.heroPhotoWrap}>
                        <Image
                            alt="Стакан с тёмным алкоголем в драматичном освещении"
                            className={styles.heroPhoto}
                            fill
                            priority
                            quality={92}
                            src="/images/hero-whiskey.jpg"
                            sizes="(max-width: 1080px) 100vw, 42vw"
                        />
                    </div>
                    <div className={styles.heroVolumeBadge}>50 ml only</div>
                    <div className={styles.heroBadge}>
                        <span>{bottles.count}</span>
                        <p>бутылок в каталоге</p>
                    </div>
                </div>
            </section>

            <section className={styles.stats}>
                <article className={styles.statCard}>
                    <strong>{overview.totalItems}</strong>
                    <span>бутылок в базе</span>
                </article>
                <article className={styles.statCard}>
                    <strong>{overview.totalTypes}</strong>
                    <span>типов алкоголя в базе</span>
                </article>
                <article className={styles.statCard}>
                    <strong>{overview.totalCollections}</strong>
                    <span>коллекций в каталоге</span>
                </article>
                <article className={styles.statCard}>
                    <strong>{overview.totalCountries}</strong>
                    <span>стран происхождения</span>
                </article>
                <article className={styles.statCard}>
                    <strong>{overview.totalUsers}</strong>
                    <span>владельцев в каталоге</span>
                </article>
            </section>

            <section className={styles.catalogSection} id="catalog">
                <Component
                    bottles={bottles.items}
                    count={bottles.count}
                    filterOptions={filterOptions}
                />
            </section>
        </main>
    );
}
