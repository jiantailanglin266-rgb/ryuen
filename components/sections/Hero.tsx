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

/**
 * タイトルロックアップ画像内に描かれた3つのボタンのクリック領域。
 * 画像(1371x341)内の金枠の実座標をピクセル解析して算出した割合値。
 */
const LOCKUP_HOTSPOTS = [
  { href: "#menu", label: "お品書きを見る", left: "48.4%", width: "15.8%" },
  { href: "#access", label: "店舗情報", left: "65.3%", width: "12.9%" },
  { href: shop.reserveUrl, label: "ご予約はこちら", left: "79.3%", width: "15.2%" },
] as const;

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

  // ロックアップ画像とスクロール誘導のリビール演出
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set("[data-hero-lockup], [data-hero-fade]", { opacity: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline({ delay: 2.3 });
      tl.fromTo(
        "[data-hero-lockup]",
        { opacity: 0, y: 36, filter: "blur(12px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.6,
          ease: "power3.out",
        }
      ).fromTo(
        "[data-hero-fade]",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 1.2, ease: "power2.out" },
        "-=0.7"
      );

      // スクロールでロックアップが静かに退く
      gsap.to("[data-hero-content]", {
        opacity: 0,
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "80% top",
          scrub: true,
        },
      });
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
        {/* 非3D環境用: 金の書ロゴ(落款) */}
        {!use3D && (
          <div className="absolute right-[10%] top-[12%] hidden w-[150px] opacity-90 md:block">
            <Image
              src="/images/logo-mark.webp"
              alt=""
              width={405}
              height={385}
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

      {/* コンテンツ: タイトルロックアップ画像 */}
      <div
        data-hero-content
        className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 pt-32 md:px-10 md:pb-0 md:pt-0"
      >
        {/* SEO・スクリーンリーダー用の見出し(視覚上は画像が担う) */}
        <h1 className="sr-only">
          氷菓飯店 龍園（HYOKA HANTEN RYUEN）- {shop.tagline}
          静かに削り、丁寧に重ねる。一杯の氷に、季節と余白を映す。
        </h1>

        <div
          data-hero-lockup
          className="relative mt-[34svh] w-full drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)] md:mt-0 md:max-w-[54vw] lg:max-w-[880px]"
        >
          {/* 和紙の光パネル(障子の光): 黒の題字を浮かび上がらせる */}
          <div
            aria-hidden="true"
            className="absolute -inset-x-[2.5%] -inset-y-[14%] rounded-[999px] bg-[#f6f2e8] opacity-95 blur-[20px]"
          />
          <Image
            src="/images/title-lockup.webp"
            alt="氷菓飯店 龍園 - 新宿に、氷の余韻を。静かに削り、丁寧に重ねる。"
            width={1371}
            height={341}
            priority
            sizes="(max-width: 768px) 96vw, 54vw"
            className="relative h-auto w-full"
          />
          {/* 画像内に描かれたボタンのクリック領域 */}
          {LOCKUP_HOTSPOTS.map((spot) => (
            <a
              key={spot.href}
              href={spot.href}
              aria-label={spot.label}
              className="absolute rounded-sm outline-offset-2 transition-shadow duration-300 hover:shadow-[0_0_24px_rgba(242,213,138,0.35)]"
              style={{
                left: spot.left,
                width: spot.width,
                top: "73%",
                height: "20%",
              }}
            />
          ))}
        </div>
      </div>

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
