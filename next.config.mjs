/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: {
      '@': './src',                    // alias utama @ → src
      '@/components': './src/components',  // spesifik untuk components (bisa tambah kalau perlu)
      // tambahkan alias lain kalau ada, misal '@/lib': './src/lib'
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    // Allow SVG images to be used with Next.js Image component
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  reactCompiler: true,
  experimental: {
    turbopack: false,
  }
};

export default nextConfig;
