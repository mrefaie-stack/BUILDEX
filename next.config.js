/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  },
  experimental: {
    optimizePackageImports: ['framer-motion', 'lucide-react'],
    // Native modules must be loaded by Node at runtime — not bundled.
    serverComponentsExternalPackages: ['better-sqlite3', 'nodemailer']
  }
};

module.exports = nextConfig;
