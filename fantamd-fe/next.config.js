/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    logging: {
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
    }
};

module.exports = nextConfig;
