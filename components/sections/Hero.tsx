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
import GoldButton from "@/components/ui/GoldButton";
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

  // テキストの一文字ずつ表示 + 金線の演出
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay: reduced ? 0 : 0.2 });
      if (reduced) {
        gsap.set("[data-hero-fade], .hero-char", { opacity: 1, y: 0 });
        gsap.set("[data-hero-line]", { scaleY: 1 });
        return;
      }
      tl.fromTo(
        "[data-hero-line]",
        { scaleY: 0 },
        { scaleY: 1, duration: 1.4, ease: "power3.inOut", delay: 2.2 }
      )
        .fromTo(
          ".hero-char",
          { opacity: 0, y: 30, filter: "blur(8px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.09,
            duration: 1.1,
            ease: "power3.out",
          },
          "-=0.8"
        )
        .fromTo(
          "[data-hero-fade]",
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.15,
            duration: 1.2,
            ease: "power2.out",
          },
          "-=0.6"
        );

      // スクロールでテキストが静かに退く
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

      {/* コンテンツ */}
      <div
        data-hero-content
        className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-start gap-8 px-6 pb-28 pt-32 md:px-10 md:pb-20"
      >
        <div className="flex items-end gap-6 md:gap-10">
          {/* 金の縦線 */}
          <div
            data-hero-line
            className="hidden h-40 w-px origin-top bg-gradient-to-b from-gold-300 via-gold-500/60 to-transparent md:block"
            aria-hidden="true"
          />
          <div>
            <p
              data-hero-fade
              className="mb-6 font-mincho text-sm tracking-[0.5em] text-gold-300 md:text-base"
            >
              {shop.tagline}
            </p>
            <h1 className="font-mincho font-medium leading-[1.15] tracking-[0.12em] text-paper">
              <span className="block text-5xl md:text-7xl lg:text-8xl">
                {"氷菓飯店".split("").map((ch, i) => (
                  <span key={i} className="hero-char inline-block">
                    {ch}
                  </span>
                ))}
              </span>
              <span className="mt-3 block text-6xl md:mt-5 md:text-8xl lg:text-9xl">
                {"龍園".split("").map((ch, i) => (
                  <span key={i} className="hero-char text-gold-gradient inline-block">
                    {ch}
                  </span>
                ))}
              </span>
            </h1>
            <p
              data-hero-fade
              className="mt-6 font-serif-en text-xs tracking-[0.55em] text-paper/60 md:text-sm"
            >
              {shop.nameEn}
            </p>
          </div>
        </div>

        <p
          data-hero-fade
          className="max-w-md font-mincho text-sm leading-loose tracking-[0.2em] text-paper/85 md:text-base"
        >
          静かに削り、丁寧に重ねる。
          <br />
          一杯の氷に、季節と余白を映す。
        </p>

        <div data-hero-fade className="mt-2 flex flex-wrap gap-4">
          <GoldButton href="#menu">お品書きを見る</GoldButton>
          <GoldButton href="#access">店舗情報</GoldButton>
          <GoldButton href={shop.reserveUrl} variant="solid">
            ご予約はこちら
          </GoldButton>
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
