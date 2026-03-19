import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  cacheHandler: require.resolve('@repo/remote-cache/remote-cache.mjs'),
  reactStrictMode: true,
  serverExternalPackages: [
    '@opentelemetry/instrumentation',
    '@opentelemetry/instrumentation-runtime-node',
    'lru-cache'
  ],
};

export default nextConfig;
