"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { gsap } from "@/lib/gsap";
import { galleryItems, type GalleryItem } from "@/data/gallery";
import SectionTitle from "@/components/ui/SectionTitle";

const SPAN_CLASS: Record<GalleryItem["span"], string> = {
  large: "md:col-span-2 md:row-span-2",
  tall: "md:row-span-2",
  wide: "md:col-span-2",
  normal: "",
};

/**
 * ギャラリー。非対称グリッド + マスクリビール + パララックス + ライトボックス。
 */
export default function Gallery() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // マスクリビール
      gsap.utils.toArray<HTMLElement>(".gallery-item").forEach((el, i) => {
        gsap.fromTo(
          el,
          { clipPath: "inset(12% 12% 12% 12%)", opacity: 0 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            opacity: 1,
            duration: 1.4,
            delay: (i % 4) * 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 88%", once: true },
          }
        );
      });
      // 微細なパララックス
      gsap.utils.toArray<HTMLElement>(".gallery-parallax").forEach((el, i) => {
        gsap.fromTo(
          el,
          { yPercent: i % 2 === 0 ? 4 : 8 },
          {
            yPercent: i % 2 === 0 ? -4 : -8,
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

  // ライトボックスのキーボード操作
  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (active === null) return;
      if (e.key === "Escape") setActive(null);
      if (e.key === "ArrowRight")
        setActive((a) => (a === null ? null : (a + 1) % galleryItems.length));
      if (e.key === "ArrowLeft")
        setActive((a) =>
          a === null ? null : (a - 1 + galleryItems.length) % galleryItems.length
        );
    },
    [active]
  );

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onKeyDown]);

  return (
    <section
      ref={rootRef}
      id="gallery"
      aria-labelledby="gallery-heading"
      className="relative bg-ink-950 py-32 md:py-44"
    >
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionTitle en="GALLERY" ja="龍園の情景" id="gallery-heading" />

        <div className="mt-16 grid grid-cols-2 gap-3 md:auto-rows-[240px] md:grid-cols-4 md:gap-5">
          {galleryItems.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActive(i)}
              data-cursor="view"
              aria-label={`${item.caption}の写真を拡大表示`}
              className={`gallery-item group relative min-h-[160px] overflow-hidden border border-paper/5 ${SPAN_CLASS[item.span]}`}
            >
              <div className="gallery-parallax absolute inset-[-8%]">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover transition-transform duration-[2s] [transition-timing-function:var(--ease-silk)] group-hover:scale-[1.05]"
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-ink-950/30 transition-opacity duration-700 group-hover:opacity-0"
              />
              <div className="absolute bottom-3 left-4 flex items-baseline gap-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <span className="font-serif-en text-[9px] tracking-[0.4em] text-gold-300">
                  {item.captionEn}
                </span>
                <span className="font-mincho text-xs tracking-[0.2em] text-paper">
                  {item.caption}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ライトボックス */}
      <AnimatePresence>
        {active !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={galleryItems[active].caption}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[105] flex items-center justify-center bg-ink-950/95 p-6 backdrop-blur-md md:p-16"
            onClick={() => setActive(null)}
          >
            <motion.figure
              initial={{ scale: 0.94, opacity: 0, filter: "blur(8px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-h-full w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden border border-gold-500/20">
                <Image
                  src={galleryItems[active].src}
                  alt={galleryItems[active].alt}
                  fill
                  sizes="90vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 flex items-center justify-between">
                <span className="flex items-baseline gap-4">
                  <span className="font-serif-en text-[10px] tracking-[0.4em] text-gold-400">
                    {galleryItems[active].captionEn}
                  </span>
                  <span className="font-mincho text-sm tracking-[0.2em] text-paper">
                    {galleryItems[active].caption}
                  </span>
                </span>
                <span className="font-serif-en text-xs tracking-[0.3em] text-paper/40">
                  {String(active + 1).padStart(2, "0")} / {String(galleryItems.length).padStart(2, "0")}
                </span>
              </figcaption>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="閉じる"
                className="absolute -top-12 right-0 flex h-10 w-10 items-center justify-center border border-paper/20 text-paper/70 transition-colors duration-300 hover:border-gold-400 hover:text-gold-300"
              >
                <span aria-hidden="true" className="text-lg leading-none">×</span>
              </button>
            </motion.figure>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
