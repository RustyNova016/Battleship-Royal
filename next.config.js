const {join} = require("path");
/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    experimental: {
        appDir: true,
    },

    devIndicators: {

        buildActivityPosition: 'bottom-right',
        buildActivity: true,
    },

    sassOptions: {
        includePaths: [join(__dirname, 'styles')],
    },

    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
        ],
    },
}

module.exports = nextConfig
