"use client";

import { useRef, type MouseEvent } from "react";
import Image from "next/image";
import { menuItems } from "@/data/menu";
import SectionTitle from "@/components/ui/SectionTitle";
import Reveal from "@/components/ui/Reveal";

/** マウス位置に応じて微細に傾くメニューカード */
function MenuCard({
  item,
  index,
}: {
  item: (typeof menuItems)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // スマホでは無効
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * 4}deg) rotateX(${-py * 4}deg)`;
    el.style.setProperty("--gx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--gy", `${(py + 0.5) * 100}%`);
  };

  const onLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0deg) rotateX(0deg)";
  };

  return (
    <Reveal delay={index * 0.12} as="li">
      <div
        ref={cardRef}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="group relative overflow-hidden border border-paper/8 bg-ink-800/60 transition-transform duration-300 ease-out"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* 背景の移動する光 */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(320px circle at var(--gx, 50%) var(--gy, 50%), rgba(242, 213, 138, 0.08), transparent 70%)",
          }}
        />
        {/* 金の罫線が描画される（上下左右から伸びる） */}
        <span aria-hidden="true" className="absolute left-0 top-0 z-20 h-px w-0 bg-gold-400/80 transition-all duration-700 [transition-timing-function:var(--ease-silk)] group-hover:w-full" />
        <span aria-hidden="true" className="absolute right-0 top-0 z-20 h-0 w-px bg-gold-400/80 transition-all delay-150 duration-700 [transition-timing-function:var(--ease-silk)] group-hover:h-full" />
        <span aria-hidden="true" className="absolute bottom-0 right-0 z-20 h-px w-0 bg-gold-400/80 transition-all delay-300 duration-700 [transition-timing-function:var(--ease-silk)] group-hover:w-full" />
        <span aria-hidden="true" className="absolute bottom-0 left-0 z-20 h-0 w-px bg-gold-400/80 transition-all delay-[450ms] duration-700 [transition-timing-function:var(--ease-silk)] group-hover:h-full" />

        {/* 画像 */}
        <div className="relative aspect-[4/3] overflow-hidden" data-cursor="view">
          <Image
            src={item.image}
            alt={item.alt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            className="object-cover transition-transform duration-[1.8s] [transition-timing-function:var(--ease-silk)] group-hover:scale-[1.06]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent"
          />
          <p className="absolute bottom-3 left-4 font-serif-en text-[10px] tracking-[0.4em] text-gold-300/90">
            {item.nameEn}
          </p>
        </div>

        {/* テキスト */}
        <div className="flex flex-col gap-3 p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 className="font-mincho text-xl tracking-[0.15em] text-paper">
              {item.name}
            </h3>
            <p className="shrink-0 font-serif-en text-lg tracking-[0.1em] text-gold-300">
              {item.price}
            </p>
          </div>
          <p className="text-xs leading-relaxed text-paper/60">{item.description}</p>
          <p className="mt-1 text-[10px] tracking-[0.15em] text-paper/40">
            {item.ingredients.join(" / ")}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export default function Menu() {
  return (
    <section
      id="menu"
      aria-labelledby="menu-heading"
      className="relative bg-ink-950 py-32 md:py-44"
    >
      <div className="mist-layer" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionTitle en="MENU" ja="お品書き" id="menu-heading" />
        <Reveal delay={0.2}>
          <p className="mt-6 max-w-lg text-sm leading-relaxed text-paper/60">
            氷・蜜・器のすべてを一杯のために。仕入れにより内容が変わる場合がございます。
          </p>
        </Reveal>

        <ul className="mt-16 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {menuItems.map((item, i) => (
            <MenuCard key={item.id} item={item} index={i} />
          ))}
        </ul>
      </div>
    </section>
  );
}
