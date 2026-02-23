/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://bastar-nirman-backend.vercel.app/:path*",
        // destination: "http://localhost:5000/:path*",
      },
    ];
  },
}

export default nextConfig
