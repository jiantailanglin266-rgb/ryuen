"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

type Props = {
  href: string;
  children: ReactNode;
  variant?: "solid" | "outline";
  external?: boolean;
  ariaLabel?: string;
  className?: string;
};

/**
 * 金の細罫線 + 光の追従を備えたブランドボタン。
 * ホバー時はマウス位置から金色の光が滲む。
 */
export default function GoldButton({
  href,
  children,
  variant = "outline",
  external = false,
  ariaLabel,
  className = "",
}: Props) {
  const ref = useRef<HTMLAnchorElement>(null);

  const onMove = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  const base =
    "group relative inline-flex items-center justify-center gap-3 overflow-hidden px-9 py-4 text-sm tracking-[0.25em] transition-colors duration-500";
  const styles =
    variant === "solid"
      ? "bg-gold-500 text-ink-950 hover:bg-gold-300"
      : "border border-gold-500/60 text-paper hover:border-gold-300";

  return (
    <a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      onMouseMove={onMove}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={`${base} ${styles} ${className}`}
    >
      {/* 光の追従レイヤー */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(140px circle at var(--mx, 50%) var(--my, 50%), rgba(242, 213, 138, 0.22), transparent 65%)",
        }}
      />
      {/* 四隅の金線（液体的に伸びる） */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-px w-0 bg-gold-300/80 transition-all duration-700 [transition-timing-function:var(--ease-silk)] group-hover:w-full"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-px w-0 bg-gold-300/80 transition-all duration-700 [transition-timing-function:var(--ease-silk)] group-hover:w-full"
      />
      <span className="relative z-10 font-mincho">{children}</span>
      <span
        aria-hidden="true"
        className="relative z-10 inline-block h-px w-6 bg-current opacity-60 transition-transform duration-500 [transition-timing-function:var(--ease-silk)] group-hover:translate-x-1 group-hover:scale-x-125"
      />
    </a>
  );
}
