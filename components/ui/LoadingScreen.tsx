"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * 初回表示演出:
 * 黒画面 → 金の細線が左右へ伸びる → 店名が一文字ずつ現れる → 全体がフェードアウト。
 * reduced-motion 時は即座に消える。
 */
export default function LoadingScreen() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDone(true);
      return;
    }

    document.documentElement.style.overflow = "hidden";

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          document.documentElement.style.overflow = "";
          setDone(true);
          window.dispatchEvent(new CustomEvent("ryuen:loaded"));
        },
      });
      tl.to(".loading-line", {
        scaleX: 1,
        duration: 1.1,
        ease: "power3.inOut",
      })
        .to(
          ".loading-char",
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            stagger: 0.12,
            duration: 0.9,
            ease: "power2.out",
          },
          "-=0.3"
        )
        .to(".loading-en", { opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.4")
        .to(root, {
          opacity: 0,
          duration: 1.0,
          delay: 0.5,
          ease: "power2.inOut",
        });
    }, root);

    return () => {
      document.documentElement.style.overflow = "";
      ctx.revert();
    };
  }, []);

  if (done) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[110] flex flex-col items-center justify-center bg-ink-950"
    >
      <div className="flex items-center gap-6">
        {"氷菓飯店 龍園".split("").map((ch, i) =>
          ch === " " ? (
            <span key={i} className="w-2" />
          ) : (
            <span
              key={i}
              className="loading-char font-mincho text-2xl tracking-widest text-paper opacity-0 md:text-4xl"
              style={{ transform: "translateY(14px)", filter: "blur(6px)" }}
            >
              {ch}
            </span>
          )
        )}
      </div>
      <div
        className="loading-line mt-8 h-px w-48 origin-center bg-gradient-to-r from-transparent via-gold-400 to-transparent md:w-72"
        style={{ transform: "scaleX(0)" }}
      />
      <p className="loading-en mt-6 font-serif-en text-[10px] tracking-[0.6em] text-gold-400 opacity-0">
        HYOKA HANTEN RYUEN
      </p>
    </div>
  );
}
