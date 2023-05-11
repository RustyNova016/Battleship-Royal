const {join} = require("path");
/** @type {import("next").NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    experimental: {
        appDir: true,
    },

    devIndicators: {
        buildActivityPosition: "bottom-right",
        buildActivity: true,
    },

    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
        ],
    },
};

module.exports = nextConfig;
