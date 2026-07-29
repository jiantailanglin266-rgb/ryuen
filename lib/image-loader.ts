import type { ImageLoaderProps } from "next/image";

/**
 * 静的エクスポート(GitHub Pages)用の画像ローダー。
 * unoptimized では basePath が付与されないため、ここで確実にプレフィックスする。
 */
export default function imageLoader({ src }: ImageLoaderProps): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${src}`;
}
