import type { NextConfig } from "next";

/**
 * STATIC_EXPORT=1 のとき GitHub Pages 向け静的エクスポート構成になる。
 * （output: export / basePath: /ryuen / 画像最適化オフ）
 * 通常の `npm run dev` / `npm run build` はサーバービルドのまま。
 */
const isExport = process.env.STATIC_EXPORT === "1";
const basePath = isExport ? "/ryuen" : "";

const nextConfig: NextConfig = {
  ...(isExport
    ? {
        output: "export" as const,
        basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        images: { formats: ["image/avif", "image/webp"] as const },
      }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  reactStrictMode: true,
};

export default nextConfig;
