"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import {
  usePrefersReducedMotion,
  useWebGLSupport,
  useDeviceTier,
} from "@/lib/hooks";
import { shop } from "@/data/shop";

// Three.js は必要時のみ動的読み込み（SSR 無効）
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

/**
 * ファーストビュー。
 * 指定画像（/images/hero-main.webp）を 3D プレーン + カスタムシェーダーで表現。
 * WebGL 非対応・reduced-motion 時は静止画 + CSS アニメーションへフォールバック。
 */
export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const tier = useDeviceTier();

  const use3D = webgl === true && !reduced;

  // スクロール誘導のリビール演出
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-hero-fade]", { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        "[data-hero-fade]",
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.15,
          duration: 1.2,
          ease: "power2.out",
          delay: 2.6,
        }
      );
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={rootRef}
      id="hero"
      aria-label="氷菓飯店 龍園 メインビジュアル"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink-950"
    >
      {/* フォールバック静止画（3D 読み込みまでの下地も兼ねる） */}
      <div
        className="absolute inset-0 flex items-center justify-center md:justify-end md:pr-[4vw]"
        aria-hidden={use3D}
      >
        <div className="relative h-[68svh] w-full max-w-full md:h-[92svh]">
          <Image
            src="/images/hero-main.webp"
            alt="金泥で描かれた龍と宝珠の絵 - 氷菓飯店 龍園"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className={`object-contain object-center md:object-right transition-opacity duration-1000 ${
              !use3D && !reduced ? "animate-[float-slow_18s_ease-in-out_infinite]" : ""
            }`}
            style={{ opacity: use3D ? 0 : 0.9 }}
          />
        </div>
        {/* 黒闇へのグラデーション（テキストの可読性を守る） */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/50" />
        <div className="absolute inset-y-0 left-0 hidden w-1/2 bg-gradient-to-r from-ink-950/80 to-transparent md:block" />
        {/* 非3D環境用: 金の書ロゴを左側に大きく表示 */}
        {!use3D && (
          <div className="absolute left-1/2 top-[30%] w-[62vw] max-w-[340px] -translate-x-1/2 opacity-95 md:left-[8%] md:top-1/2 md:w-[34vw] md:max-w-[480px] md:-translate-x-0 md:-translate-y-1/2">
            <Image
              src="/images/logo-mark.webp"
              alt="氷菓飯店 龍園 ロゴ"
              width={405}
              height={385}
              priority
              className="h-auto w-full"
            />
          </div>
        )}
      </div>

      {/* 3D シーン */}
      {use3D && (
        <div className="absolute inset-0">
          <HeroScene tier={tier} />
        </div>
      )}

      {/* SEO・スクリーンリーダー用の見出し(視覚上は3Dロゴが担う) */}
      <h1 className="sr-only">
        氷菓飯店 龍園（HYOKA HANTEN RYUEN）- {shop.tagline}
        静かに削り、丁寧に重ねる。一杯の氷に、季節と余白を映す。
      </h1>

      {/* スクロール誘導（縦書き + 細線） */}
      <div
        data-hero-fade
        className="absolute bottom-8 right-6 z-10 flex flex-col items-center gap-4 md:right-12"
        aria-hidden="true"
      >
        <span className="writing-vertical font-serif-en text-[10px] tracking-[0.5em] text-paper/50">
          SCROLL
        </span>
        <div className="relative h-20 w-px overflow-hidden bg-paper/10">
          <div className="absolute inset-0 origin-top bg-gold-400 [animation:scroll-hint_2.6s_var(--ease-brand)_infinite]" />
        </div>
      </div>
    </section>
  );
}
