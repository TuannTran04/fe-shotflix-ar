/** @type {import('next').NextConfig} */
const nextConfig = {
  //   experimental: {
  //     forceSwcTransforms: true,
  //   },
  // reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;

// module.exports = nextConfig;
