/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['v0.blob.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // Mengoptimalkan audio file
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3|wav|ogg|flac|aac)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/media/',
            outputPath: 'static/media/',
            name: '[name].[hash].[ext]',
          },
        },
      ],
    });
    return config;
  },
  // Mengoptimalkan untuk Vercel
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  // Menangani error 404 dengan halaman kustom
  async redirects() {
    return [
      {
        source: '/admin/:path*',
        destination: '/admin',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
