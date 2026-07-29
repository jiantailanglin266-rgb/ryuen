"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { shop } from "@/data/shop";

const NAV = [
  { href: "#concept", label: "龍園について", en: "CONCEPT" },
  { href: "#menu", label: "お品書き", en: "MENU" },
  { href: "#craft", label: "こだわり", en: "CRAFT" },
  { href: "#access", label: "店舗情報", en: "ACCESS" },
  { href: "#reserve", label: "ご予約", en: "RESERVE" },
];

/** 透明 → スクロール後に半透明ブラックへ変化するヘッダー */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[90] transition-all duration-700 ${
        scrolled
          ? "bg-ink-950/75 shadow-[0_1px_0_rgba(198,161,91,0.15)] backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-5 md:px-10">
        {/* ロゴ */}
        <Link href="/" className="group flex items-center gap-3" aria-label="氷菓飯店 龍園 トップへ">
          <span className="flex h-9 w-9 items-center justify-center border border-gold-500/60 transition-colors duration-500 group-hover:border-gold-300">
            <span className="font-mincho text-lg leading-none text-gold-400">龍</span>
          </span>
          <span className="flex flex-col">
            <span className="font-mincho text-sm tracking-[0.3em] text-paper">
              氷菓飯店 龍園
            </span>
            <span className="font-serif-en text-[9px] tracking-[0.4em] text-gold-500/80">
              HYOKA HANTEN RYUEN
            </span>
          </span>
        </Link>

        {/* PC ナビ */}
        <nav aria-label="メインナビゲーション" className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) =>
            item.href === "#reserve" ? (
              <a
                key={item.href}
                href={shop.reserveUrl}
                className="border border-gold-500/60 px-6 py-2.5 font-mincho text-sm tracking-[0.2em] text-gold-300 transition-all duration-500 hover:border-gold-300 hover:bg-gold-500/10"
              >
                {item.label}
              </a>
            ) : (
              <a
                key={item.href}
                href={item.href}
                className="link-underline font-mincho text-sm tracking-[0.2em] text-paper/90 transition-colors duration-300 hover:text-gold-300"
              >
                {item.label}
              </a>
            )
          )}
        </nav>

        {/* モバイル メニューボタン */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          className="relative z-[96] flex h-11 w-11 flex-col items-center justify-center gap-[7px] lg:hidden"
        >
          <span
            className={`h-px w-7 bg-gold-300 transition-transform duration-500 ${
              open ? "translate-y-[4px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-7 bg-gold-300 transition-transform duration-500 ${
              open ? "-translate-y-[4px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* モバイル 全画面メニュー */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[95] flex flex-col justify-center bg-ink-950/97 lg:hidden"
          >
            {/* 墨が広がる背景 */}
            <motion.div
              aria-hidden="true"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 3, opacity: 1 }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmax] w-[60vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(17,17,17,0.9) 0%, rgba(5,5,5,0) 70%)",
              }}
            />
            {/* 金の縦線 */}
            <motion.div
              aria-hidden="true"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="absolute left-8 top-0 h-full w-px origin-top bg-gradient-to-b from-transparent via-gold-500/40 to-transparent"
            />
            <nav aria-label="モバイルナビゲーション" className="relative z-10 flex flex-col gap-2 px-12">
              {NAV.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.09, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                >
                  <a
                    href={item.href === "#reserve" ? shop.reserveUrl : item.href}
                    onClick={() => setOpen(false)}
                    className="group flex items-baseline gap-4 py-4"
                  >
                    <span className="font-serif-en text-[10px] tracking-[0.4em] text-gold-500">
                      {item.en}
                    </span>
                    <span className="font-mincho text-2xl tracking-[0.2em] text-paper transition-colors duration-300 group-hover:text-gold-300">
                      {item.label}
                    </span>
                  </a>
                  <motion.div
                    aria-hidden="true"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.4 + i * 0.09, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="h-px origin-left bg-gradient-to-r from-gold-500/40 to-transparent"
                  />
                </motion.div>
              ))}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9, duration: 0.8 }}
                className="mt-8 font-serif-en text-[10px] tracking-[0.5em] text-gold-500/70"
              >
                SHINJUKU, TOKYO
              </motion.p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
