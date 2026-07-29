"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import DragonOrnament from "@/components/decor/DragonOrnament";

/**
 * 背景装飾: 両サイドの金の龍。
 * - ローディング演出後に金線が「描かれていく」ように出現（strokeDashoffset）
 * - スクロールに応じてゆっくり視差移動（左右で速度を変え非対称に）
 * - 呼吸のような明滅と、かすかな浮遊
 * - コンテンツ側へはマスクでフェードし可読性を守る / pointer-events なし
 * - モバイル・タブレットでは非表示（lg 以上のみ）
 * - prefers-reduced-motion 時はアニメーションなしで静的表示
 */
export default function SideDragons() {
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const left = leftRef.current;
    const right = rightRef.current;
    if (!left || !right) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = gsap.context(() => {
      const drawPaths = gsap.utils.toArray<SVGPathElement>(".dragon-draw");
      const fadeEls = gsap.utils.toArray<SVGElement>(".dragon-fade");

      if (reduced) {
        gsap.set([left, right], { opacity: 1 });
        return;
      }

      // 初期状態: 線は未描画、点は透明
      drawPaths.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.set(fadeEls, { opacity: 0 });
      gsap.set([left, right], { opacity: 1 });

      const play = () => {
        // 金線が静かに描かれていく
        gsap.to(drawPaths, {
          strokeDashoffset: 0,
          duration: 2.6,
          ease: "power2.inOut",
          stagger: { each: 0.045, from: "start" },
        });
        gsap.to(fadeEls, {
          opacity: (i, el) =>
            parseFloat((el as SVGElement).getAttribute("opacity") || "1"),
          duration: 1.8,
          delay: 2.2,
          ease: "power2.out",
          stagger: 0.08,
        });
      };

      // ローディング演出の完了を待つ（未発火でも4.5秒で開始）
      let started = false;
      const start = () => {
        if (started) return;
        started = true;
        play();
      };
      window.addEventListener("ryuen:loaded", start, { once: true });
      const fallback = setTimeout(start, 4500);

      // スクロール視差（左右で速度を変え、非対称の奥行きを出す）
      gsap.to(left, {
        y: -70,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "max",
          scrub: 1.2,
        },
      });
      gsap.to(right, {
        y: -130,
        ease: "none",
        scrollTrigger: {
          trigger: document.body,
          start: "top top",
          end: "max",
          scrub: 1.6,
        },
      });

      // かすかな浮遊と呼吸
      gsap.to(left.querySelector(".dragon-float"), {
        y: 10,
        duration: 9,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to(right.querySelector(".dragon-float"), {
        y: -12,
        duration: 11,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });
      gsap.to([left, right], {
        opacity: 0.72,
        duration: 7,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: 5,
      });

      return () => {
        clearTimeout(fallback);
        window.removeEventListener("ryuen:loaded", start);
      };
    });

    return () => ctx.revert();
  }, []);

  const common =
    "pointer-events-none fixed inset-y-0 z-[60] hidden w-[clamp(130px,10.5vw,200px)] opacity-0 mix-blend-screen lg:block";

  return (
    <div aria-hidden="true">
      {/* 左: 頭が上・やや下がり位置から立ち上る */}
      <div
        ref={leftRef}
        className={`${common} left-0`}
        style={{
          maskImage:
            "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.35) 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, rgba(0,0,0,0.85), rgba(0,0,0,0.35) 70%, transparent)",
        }}
      >
        <div className="dragon-float flex h-full items-center py-[6vh]">
          <DragonOrnament side="left" />
        </div>
      </div>

      {/* 右: 反転・少し上下位置をずらして非対称に */}
      <div
        ref={rightRef}
        className={`${common} right-0`}
        style={{
          maskImage:
            "linear-gradient(to left, rgba(0,0,0,0.85), rgba(0,0,0,0.35) 70%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to left, rgba(0,0,0,0.85), rgba(0,0,0,0.35) 70%, transparent)",
        }}
      >
        <div className="dragon-float flex h-full translate-y-[7vh] items-center py-[6vh]">
          <DragonOrnament side="right" />
        </div>
      </div>
    </div>
  );
}
