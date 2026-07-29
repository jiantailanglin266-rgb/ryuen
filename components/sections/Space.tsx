import Image from "next/image";
import Reveal from "@/components/ui/Reveal";

/**
 * 店舗空間。障子の光と格子を抽象化した SVG アニメーションを背景に敷く。
 */
export default function Space() {
  return (
    <section
      id="space"
      aria-labelledby="space-heading"
      className="relative overflow-hidden bg-ink-900 py-32 md:py-48"
    >
      {/* 障子・格子の抽象 SVG */}
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full opacity-[0.06]"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="shojiLight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f8f6f0" stopOpacity="0.9" />
            <stop offset="1" stopColor="#c6a15b" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        {/* 縦の格子 */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={`v${i}`}
            x={`${(i + 1) * 8}%`}
            y="0"
            width="1"
            height="100%"
            fill="url(#shojiLight)"
            style={{
              animation: `shoji-light ${6 + (i % 4)}s ease-in-out ${i * 0.5}s infinite`,
            }}
          />
        ))}
        {/* 横の格子 */}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect
            key={`h${i}`}
            x="0"
            y={`${(i + 1) * 15}%`}
            width="100%"
            height="1"
            fill="url(#shojiLight)"
            style={{
              animation: `shoji-light ${8 + (i % 3)}s ease-in-out ${i * 0.8}s infinite`,
            }}
          />
        ))}
      </svg>

      {/* 障子越しの淡い光 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[10%] h-[60%] w-[50%] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(ellipse, rgba(248,246,240,0.05) 0%, transparent 65%)",
        }}
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-6 md:flex-row md:items-center md:gap-20 md:px-10">
        <div className="md:flex-1">
          <Reveal>
            <p className="font-serif-en text-xs tracking-[0.5em] text-gold-400">SPACE</p>
            <h2
              id="space-heading"
              className="mt-6 font-mincho text-3xl font-medium leading-[1.9] tracking-[0.18em] text-paper md:text-5xl"
            >
              喧騒を離れ、
              <br />
              氷と向き合う時間。
            </h2>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="gold-line mt-8 w-16 opacity-60" aria-hidden="true" />
            <p className="mt-8 max-w-md text-sm leading-[2.4] text-paper/70">
              黒を基調に、柔らかな間接照明と金のアクセントをあしらった店内。
              新宿の喧騒から一歩離れ、削りたての氷が変化していく静かな時間を、
              ゆっくりとお過ごしください。
            </p>
          </Reveal>
        </div>

        <div className="relative md:flex-1">
          <Reveal delay={0.15}>
            <div className="relative aspect-[3/4] overflow-hidden border border-gold-500/15" data-cursor="view">
              <Image
                src="/images/space-main.webp"
                alt="黒を基調とした店内。柔らかな間接照明とカウンター席"
                fill
                sizes="(max-width: 768px) 100vw, 45vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-ink-950/50 to-transparent"
              />
            </div>
          </Reveal>
          {/* 金の飾り枠 */}
          <div
            aria-hidden="true"
            className="absolute -bottom-4 -right-4 -z-10 h-full w-full border border-gold-500/25"
          />
        </div>
      </div>
    </section>
  );
}
