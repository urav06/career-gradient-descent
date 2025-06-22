import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for deployment to GCS
  output: 'export',
  trailingSlash: true,
  
  // Image optimization disabled for static export
  images: {
    unoptimized: true
  },
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Performance optimizations
  poweredByHeader: false,
  
  // Build optimization
  distDir: 'out',
  
  // TypeScript configuration
  typescript: {
    // Type checking is handled in CI/CD
    ignoreBuildErrors: false,
  },
  
  // ESLint configuration  
  eslint: {
    // Linting is handled in CI/CD
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
