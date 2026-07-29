"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import {
  useDeviceTier,
  useInViewOnce,
  usePrefersReducedMotion,
  useWebGLSupport,
} from "@/lib/hooks";
import GoldButton from "@/components/ui/GoldButton";
import Reveal from "@/components/ui/Reveal";
import { shop } from "@/data/shop";

// ビューポートに近づいたときだけ 3D を読み込む
const CtaScene = dynamic(() => import("@/components/three/CtaScene"), {
  ssr: false,
});

/**
 * 最終CTA。背景にはファーストビューとは異なる氷の結晶の 3D 表現。
 */
export default function FinalCta() {
  const rootRef = useRef<HTMLElement>(null);
  const inView = useInViewOnce(rootRef, "300px");
  const reduced = usePrefersReducedMotion();
  const webgl = useWebGLSupport();
  const tier = useDeviceTier();

  const use3D = inView && webgl === true && !reduced;

  return (
    <section
      ref={rootRef}
      id="final-cta"
      aria-labelledby="final-cta-heading"
      className="relative overflow-hidden bg-ink-950 py-40 md:py-56"
    >
      {/* 3D の氷の結晶（フォールバック: CSS の光） */}
      {use3D ? (
        <div className="absolute inset-0 opacity-70">
          <CtaScene tier={tier} />
        </div>
      ) : (
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50"
          style={{
            background:
              "radial-gradient(circle, rgba(207,228,242,0.08) 0%, rgba(198,161,91,0.05) 40%, transparent 70%)",
          }}
        />
      )}

      <div className="mist-layer" aria-hidden="true" />

      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 text-center">
        <Reveal>
          <h2
            id="final-cta-heading"
            className="font-mincho text-3xl font-medium leading-[2] tracking-[0.22em] text-paper md:text-5xl"
          >
            今日という季節を、
            <br />
            一杯の氷に。
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="gold-line mx-auto mt-10 w-20 opacity-70" aria-hidden="true" />
        </Reveal>
        <Reveal delay={0.35}>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <GoldButton href={shop.reserveUrl} variant="solid">
              ご予約はこちら
            </GoldButton>
            <GoldButton href={shop.gmapLinkUrl} external>
              Googleマップで見る
            </GoldButton>
            <GoldButton href={shop.instagramUrl} external>
              Instagramを見る
            </GoldButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
