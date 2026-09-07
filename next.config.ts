import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['@prisma/client', '@prisma/adapter-pg'],
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            // Wide open in dev for convenience; production should list
            // real allowed origins (customer web, advisor web, admin panel)
            // via env vars rather than '*', since '*' + credentials is
            // unsafe and browsers will reject it anyway if you ever send
            // cookies cross-origin.
            value: isDev ? '*' : process.env.ALLOWED_ORIGIN || '',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;