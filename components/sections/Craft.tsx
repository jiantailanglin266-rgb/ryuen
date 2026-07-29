"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import SectionTitle from "@/components/ui/SectionTitle";
import Reveal from "@/components/ui/Reveal";

const CRAFTS = [
  {
    num: "01",
    kanji: "氷",
    en: "ICE",
    text: "口どけと温度を見極め、削り方を細かく調整します。",
  },
  {
    num: "02",
    kanji: "蜜",
    en: "SYRUP",
    text: "素材本来の香りを生かし、店舗で丁寧に仕込みます。",
  },
  {
    num: "03",
    kanji: "器",
    en: "VESSEL",
    text: "氷の表情が最も美しく見える器を選びます。",
  },
];

/**
 * 龍園のこだわり。巨大な数字 × 縦書き × ガラス質のオブジェクトで構成。
 */
export default function Craft() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 巨大数字のパララックス
      gsap.utils.toArray<HTMLElement>(".craft-num").forEach((el) => {
        gsap.fromTo(
          el,
          { yPercent: 20 },
          {
            yPercent: -20,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="craft"
      aria-labelledby="craft-heading"
      className="relative overflow-hidden bg-ink-900 py-32 md:py-48"
    >
      <div className="mist-layer" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionTitle en="CRAFT" ja="龍園のこだわり" id="craft-heading" />

        <div className="mt-20 flex flex-col gap-24 md:gap-32">
          {CRAFTS.map((craft, i) => (
            <div
              key={craft.num}
              className={`relative flex flex-col gap-8 md:flex-row md:items-center md:gap-16 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* 巨大な数字 */}
              <div
                aria-hidden="true"
                className="craft-num pointer-events-none absolute -top-14 select-none font-serif-en text-[9rem] font-light leading-none text-paper/[0.04] md:relative md:top-0 md:text-[13rem]"
              >
                {craft.num}
              </div>

              {/* 氷を思わせるガラス質オブジェクト */}
              <Reveal delay={0.1} className="relative z-10 md:flex-1">
                <div className="relative mx-auto flex h-52 w-52 items-center justify-center md:h-64 md:w-64">
                  {/* ガラス質の菱形 */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-4 rotate-45 border border-ice/20 bg-gradient-to-br from-ice/10 via-transparent to-gold-500/8 backdrop-blur-[2px] [animation:float-slow_10s_ease-in-out_infinite]"
                    style={{ boxShadow: "inset 0 0 40px rgba(207,228,242,0.07), 0 0 60px rgba(207,228,242,0.05)" }}
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-10 rotate-12 border border-gold-500/25 [animation:float-slow_13s_ease-in-out_infinite_reverse]"
                  />
                  {/* 縦書きの漢字一文字 */}
                  <p className="writing-vertical relative z-10 font-mincho text-6xl font-medium text-gold-gradient md:text-7xl">
                    {craft.kanji}
                  </p>
                </div>
              </Reveal>

              {/* テキスト */}
              <Reveal delay={0.25} className="relative z-10 md:flex-1">
                <div className={i % 2 === 1 ? "md:text-right" : ""}>
                  <p className="font-serif-en text-xs tracking-[0.5em] text-gold-500">
                    {craft.en}
                  </p>
                  <h3 className="mt-4 font-mincho text-3xl tracking-[0.3em] text-paper md:text-4xl">
                    {craft.kanji}
                  </h3>
                  <div
                    className={`gold-line mt-6 w-16 opacity-60 ${i % 2 === 1 ? "md:ml-auto" : ""}`}
                    aria-hidden="true"
                  />
                  <p className="mt-6 max-w-md font-mincho text-base leading-[2.4] tracking-[0.12em] text-paper/80 md:text-lg">
                    {craft.text}
                  </p>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
