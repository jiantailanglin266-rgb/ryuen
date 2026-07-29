"use client";

import { useEffect, useState } from "react";

/** prefers-reduced-motion を監視する */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

/** WebGL が利用可能か（非対応環境では静止画フォールバック） */
export function useWebGLSupport(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);
  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ||
        canvas.getContext("webgl") ||
        canvas.getContext("experimental-webgl");
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);
  return supported;
}

/** モバイル・低スペック端末の判定（粒子数の調整に使用） */
export function useDeviceTier(): "high" | "low" {
  const [tier, setTier] = useState<"high" | "low">("high");
  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowMemory = nav.deviceMemory !== undefined && nav.deviceMemory < 4;
    const lowCores =
      navigator.hardwareConcurrency !== undefined &&
      navigator.hardwareConcurrency <= 4;
    setTier(isMobile || lowMemory || lowCores ? "low" : "high");
  }, []);
  return tier;
}

/** 要素が一度でもビューポートに入ったか（3D シーンの遅延マウントに使用） */
export function useInViewOnce<T extends Element>(
  ref: React.RefObject<T | null>,
  rootMargin = "200px"
): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || inView) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, inView, rootMargin]);
  return inView;
}
