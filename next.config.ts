import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.hashnode.com',
        pathname: '/**',  // allow any path on this domain
      },
    ],
  },
};

export default nextConfig;