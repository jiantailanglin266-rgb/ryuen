"use client";

import { useEffect, useState } from "react";
import { shop } from "@/data/shop";

/** スマートフォン専用: 画面下部の固定CTA（予約・電話・地図） */
export default function FixedMobileCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-[85] grid grid-cols-3 border-t border-gold-500/30 bg-ink-950/92 backdrop-blur-md transition-transform duration-500 [transition-timing-function:var(--ease-silk)] md:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <a
        href={shop.reserveUrl}
        className="flex flex-col items-center gap-1 py-3 text-gold-300"
      >
        <span className="font-serif-en text-[9px] tracking-[0.3em]">RESERVE</span>
        <span className="font-mincho text-xs tracking-[0.15em]">ご予約</span>
      </a>
      <a
        href={shop.telLink}
        className="flex flex-col items-center gap-1 border-x border-gold-500/20 py-3 text-paper"
      >
        <span className="font-serif-en text-[9px] tracking-[0.3em]">TEL</span>
        <span className="font-mincho text-xs tracking-[0.15em]">お電話</span>
      </a>
      <a
        href={shop.gmapLinkUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 py-3 text-paper"
      >
        <span className="font-serif-en text-[9px] tracking-[0.3em]">MAP</span>
        <span className="font-mincho text-xs tracking-[0.15em]">経路</span>
      </a>
    </div>
  );
}
