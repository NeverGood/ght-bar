/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },

    images: {
        disableStaticImages: true,
        remotePatterns: [
            {
                protocol: "http",
                hostname: "**",
                port: "",
                pathname: "**",
            },
        ],
    },

    webpack(config, { isServer }) {
        config.module.rules.push({
            test: /\.svg$/i,
            issuer: /\.[jt]sx?$/,
            use: ["@svgr/webpack"],
        });

        if (!isServer) {
            config.resolve.fallback.net = false;
            config.resolve.fallback.tls = false;
            config.resolve.fallback.fs = false;
        }

        return config;
    },
    env: {
        MYSQL_HOST: process.env.MYSQL_HOST,
        MYSQL_PORT: process.env.MYSQL_PORT,
        MYSQL_DATABASE: process.env.MYSQL_DATABASE,
        MYSQL_USER: process.env.MYSQL_USER,
        MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
    },
};

module.exports = nextConfig;
