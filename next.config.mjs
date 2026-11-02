/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    devIndicators: false,
    distDir: process.env.NEXT_DIST_DIR || '.next',
    webpack: (config) => {
        config.cache = false;
        return config;
    },
};
export default nextConfig;
