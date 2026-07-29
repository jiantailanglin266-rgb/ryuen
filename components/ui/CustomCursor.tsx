"use client";

import { useEffect, useRef, useState } from "react";

/**
 * PC 専用カスタムカーソル。
 * 通常時: 小さな金の点 / リンク上: 円が拡大 / 画像上: 「VIEW」表示。
 * タッチ端末・reduced-motion では無効。
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState<"default" | "link" | "view">("default");

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("custom-cursor");

    let x = -100;
    let y = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const target = e.target as HTMLElement;
      if (target.closest('[data-cursor="view"]')) {
        setMode("view");
      } else if (target.closest("a, button, [role='button']")) {
        setMode("link");
      } else {
        setMode("default");
      }
    };

    const loop = () => {
      rx += (x - rx) * 0.14;
      ry += (y - ry) * 0.14;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${rx}px, ${ry}px, 0)`;
      }
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("custom-cursor");
    };
  }, []);

  if (!enabled) return null;

  const ringSize =
    mode === "view" ? "h-20 w-20" : mode === "link" ? "h-12 w-12" : "h-8 w-8";

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      {/* 中心の金の点 */}
      <div
        ref={dotRef}
        className="absolute left-0 top-0 will-change-transform"
        style={{ marginLeft: "-2px", marginTop: "-2px" }}
      >
        <div
          className={`h-1 w-1 rounded-full bg-gold-300 transition-opacity duration-300 ${
            mode === "view" ? "opacity-0" : "opacity-100"
          }`}
        />
      </div>
      {/* 追従リング */}
      <div ref={ringRef} className="absolute left-0 top-0 will-change-transform">
        <div
          className={`flex ${ringSize} -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-500 [transition-timing-function:var(--ease-silk)] ${
            mode === "view"
              ? "border-gold-300/80 bg-ink-950/50 backdrop-blur-sm"
              : "border-gold-500/50"
          }`}
        >
          <span
            className={`font-serif-en text-[10px] tracking-[0.3em] text-gold-300 transition-opacity duration-300 ${
              mode === "view" ? "opacity-100" : "opacity-0"
            }`}
          >
            VIEW
          </span>
        </div>
      </div>
    </div>
  );
}
