import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Disabled `cacheComponents`: this app is dynamic-by-default (per-visitor
     profiles resolved from the session cookie), so every request should hit
     the server. Re-enable when adopting cache-first rendering. */
  cacheComponents: false,
  // A stray package-lock.json in the parent folder made Next infer the wrong
  // workspace root; pin it to this project explicitly.
  outputFileTracingRoot: __dirname,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
