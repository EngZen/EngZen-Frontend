import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_HOST_URL: process.env.API_HOST_URL,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@hookform/resolvers",
      "zod",
      "date-fns",
      "lodash",
    ],
  },
  async rewrites() {
    const apiHost = process.env.API_HOST_URL;
    if (!apiHost) {
      console.warn(
        "WARN: API_HOST_URL is not defined. API rewrites will be disabled.",
      );
      return [];
    }
    return [
      {
        source: "/api/:path*",
        destination: `${apiHost}/api/:path*`,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
