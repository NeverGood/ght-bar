"use client";

import React from "react";
import Image from "next/image";

import { Item } from "@/models/types";

export function getBottleImageUrl(image: Item["image"]) {
    const defaultImageUrl = "/images/whiskey.svg";

    return image
        ? `http://ght.bar/images/${encodeURIComponent(image)}`
        : defaultImageUrl;
}

export default function ImageComponent({
    image,
    name,
    className = "h-40 w-40 rounded-full",
    height = 200,
    width = 200,
    quality = 30,
}: {
    image: Item["image"];
    name: Item["name"];
    className?: string;
    height?: number;
    width?: number;
    quality?: number;
}) {
    const defaultImageUrl = "/images/whiskey.svg";
    const [imageSrc, setImageSrc] = React.useState(getBottleImageUrl(image));
    const isRemoteImage = imageSrc.startsWith("http://") || imageSrc.startsWith("https://");

    React.useEffect(() => {
        setImageSrc(getBottleImageUrl(image));
    }, [image]);

    return (
        <Image
            alt={name}
            blurDataURL={defaultImageUrl}
            className={className}
            height={height}
            loading="lazy"
            onError={() => setImageSrc(defaultImageUrl)}
            placeholder="blur"
            quality={quality}
            src={imageSrc}
            unoptimized={isRemoteImage}
            width={width}
        />
    );
}
