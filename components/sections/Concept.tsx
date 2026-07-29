"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import Reveal from "@/components/ui/Reveal";

/**
 * ブランドコンセプト。
 * 縦書き見出し × 横書き本文、スクロールで行が順に立ち上がる。
 */
export default function Concept() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // 本文の行が順に現れる
      gsap.fromTo(
        ".concept-line",
        { opacity: 0, y: 26, filter: "blur(6px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.25,
          duration: 1.4,
          ease: "power3.out",
          scrollTrigger: {
            trigger: root,
            start: "top 65%",
            once: true,
          },
        }
      );
      // 金箔パーティクルがゆっくり漂う
      gsap.utils.toArray<HTMLElement>(".concept-dust").forEach((el, i) => {
        gsap.to(el, {
          y: -30 - i * 10,
          x: i % 2 === 0 ? 14 : -14,
          opacity: 0,
          duration: 8 + i * 2,
          repeat: -1,
          ease: "none",
          delay: i * 1.4,
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="concept"
      aria-labelledby="concept-heading"
      className="relative overflow-hidden bg-ink-900 py-32 md:py-48"
    >
      {/* 水墨画のような霧 */}
      <div className="mist-layer" aria-hidden="true" />

      {/* 金箔の微細パーティクル */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {[15, 35, 55, 72, 88].map((left, i) => (
          <span
            key={i}
            className="concept-dust absolute h-1 w-1 rounded-full bg-gold-300/60"
            style={{ left: `${left}%`, top: `${30 + (i % 3) * 20}%` }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 md:flex-row md:items-start md:justify-between md:px-10">
        {/* 縦書き見出し */}
        <Reveal>
          <div className="flex gap-8">
            <h2
              id="concept-heading"
              className="writing-vertical font-mincho text-3xl font-medium leading-[1.8] tracking-[0.3em] text-paper md:text-5xl"
            >
              一椀の氷に、
              <span className="text-gold-gradient">季節の記憶</span>を。
            </h2>
            <div className="flex flex-col items-center gap-4" aria-hidden="true">
              <div className="h-24 w-px bg-gradient-to-b from-gold-400 to-transparent" />
              <span className="writing-vertical font-serif-en text-[10px] tracking-[0.5em] text-gold-500">
                CONCEPT
              </span>
            </div>
          </div>
        </Reveal>

        {/* 本文 */}
        <div className="max-w-xl md:pt-10">
          <p className="concept-line font-mincho text-base leading-[2.6] tracking-[0.16em] text-paper/90 md:text-lg">
            氷菓飯店 龍園では、素材の香り、口どけ、器、
          </p>
          <p className="concept-line font-mincho text-base leading-[2.6] tracking-[0.16em] text-paper/90 md:text-lg">
            余白までをひとつの作品として捉えています。
          </p>
          <p className="concept-line mt-8 font-mincho text-base leading-[2.6] tracking-[0.16em] text-paper/90 md:text-lg">
            削りたての氷に、旬の果実や自家製蜜を重ね、
          </p>
          <p className="concept-line font-mincho text-base leading-[2.6] tracking-[0.16em] text-paper/90 md:text-lg">
            最後のひと口まで表情が変わる一杯をご提供します。
          </p>

          <Reveal delay={0.6} className="mt-12">
            <div className="gold-line w-24 opacity-60" aria-hidden="true" />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
