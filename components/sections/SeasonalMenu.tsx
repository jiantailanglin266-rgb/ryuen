"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { seasonalItems } from "@/data/menu";
import SectionTitle from "@/components/ui/SectionTitle";

/**
 * 季節限定メニュー。
 * PC: ピン留め + 横スクロールで春夏秋冬の四章を移動、背景色が静かに切り替わる。
 * スマホ: ネイティブ横スクロール（scroll-snap）で軽量に。
 */
export default function SeasonalMenu() {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();
    mm.add("(min-width: 1024px)", () => {
      const panels = gsap.utils.toArray<HTMLElement>(".season-panel");
      const totalScroll = track.scrollWidth - window.innerWidth;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: () => `+=${totalScroll + window.innerHeight * 0.5}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(track, { x: -totalScroll, ease: "none" });

      // 背景色を章ごとに変化させる
      panels.forEach((panel, i) => {
        const bg = seasonalItems[i]?.bg ?? "#0a0a0a";
        gsap.to(root, {
          backgroundColor: bg,
          duration: 0.5,
          scrollTrigger: {
            trigger: panel,
            containerAnimation: tl,
            start: "left 60%",
            toggleActions: "play none none reverse",
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      id="seasonal"
      aria-labelledby="seasonal-heading"
      className="relative overflow-hidden bg-ink-900 transition-colors"
    >
      <div className="pt-28 md:pt-36">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <SectionTitle en="SEASONAL" ja="季節限定" id="seasonal-heading" />
        </div>
      </div>

      {/* 横スクロールトラック（スマホは scroll-snap） */}
      <div
        className="overflow-x-auto pb-24 pt-14 [scrollbar-width:none] lg:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-6 px-6 md:gap-10 md:px-10 lg:w-max lg:snap-none"
        >
          {seasonalItems.map((item, i) => (
            <article
              key={item.id}
              className="season-panel group relative w-[80vw] max-w-[420px] shrink-0 snap-center overflow-hidden border border-paper/8 bg-ink-950/40 lg:w-[36vw]"
            >
              <div className="relative aspect-[3/4] overflow-hidden" data-cursor="view">
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 1024px) 80vw, 36vw"
                  className="object-cover transition-transform duration-[2s] [transition-timing-function:var(--ease-silk)] group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent"
                />
                {/* 章番号と季節 */}
                <div className="absolute left-5 top-5 flex items-center gap-3">
                  <span className="font-serif-en text-xs tracking-[0.3em] text-paper/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="h-px w-8 bg-paper/30" aria-hidden="true" />
                  <span className="font-serif-en text-xs tracking-[0.4em]" style={{ color: item.accent }}>
                    {item.seasonEn}
                  </span>
                </div>
                {/* 縦書きの季節名 */}
                <p
                  className="writing-vertical absolute right-5 top-5 font-mincho text-4xl tracking-[0.3em]"
                  style={{ color: item.accent }}
                  aria-hidden="true"
                >
                  {item.season}
                </p>
                <div className="absolute inset-x-5 bottom-5">
                  <h3 className="font-mincho text-2xl tracking-[0.15em] text-paper">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-paper/70">
                    {item.description}
                  </p>
                </div>
              </div>
            </article>
          ))}

          {/* 末尾の余白パネル（PC 横スクロール用） */}
          <div className="hidden w-[10vw] shrink-0 lg:block" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
