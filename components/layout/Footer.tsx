import Link from "next/link";
import { shop } from "@/data/shop";
import Reveal from "@/components/ui/Reveal";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink-950">
      {/* フッター直前の巨大「龍園」 */}
      <div
        aria-hidden="true"
        className="pointer-events-none flex select-none justify-center overflow-hidden"
      >
        <Reveal y={60}>
          <p className="font-mincho text-[28vw] font-medium leading-none tracking-[0.1em] text-paper/[0.035] md:text-[20vw]">
            龍園
          </p>
        </Reveal>
      </div>

      <div className="gold-line mx-auto max-w-6xl opacity-40" aria-hidden="true" />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-3 md:px-10">
        {/* ロゴ */}
        <div className="flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-3" aria-label="氷菓飯店 龍園 トップへ">
            <span className="flex h-10 w-10 items-center justify-center border border-gold-500/60">
              <span className="font-mincho text-xl leading-none text-gold-400">龍</span>
            </span>
            <span className="flex flex-col">
              <span className="font-mincho text-base tracking-[0.3em] text-paper">
                {shop.name}
              </span>
              <span className="font-serif-en text-[9px] tracking-[0.4em] text-gold-500/80">
                {shop.nameEn}
              </span>
            </span>
          </Link>
          <p className="text-xs leading-relaxed text-paper/50">
            静かに削り、丁寧に重ねる。
            <br />
            一杯の氷に、季節と余白を映す。
          </p>
        </div>

        {/* 店舗情報 */}
        <address className="flex flex-col gap-2 text-sm not-italic text-paper/70">
          <p className="font-mincho tracking-[0.2em] text-gold-400">店舗情報</p>
          <p>
            〒{shop.address.postalCode} {shop.address.prefecture}
            {shop.address.city}
            {shop.address.street}
          </p>
          <p>営業時間：{shop.hours}（{shop.holidays}）</p>
          <p>
            電話：
            <a href={shop.telLink} className="link-underline hover:text-gold-300">
              {shop.tel}
            </a>
          </p>
        </address>

        {/* リンク */}
        <nav aria-label="フッターナビゲーション" className="flex flex-col gap-2 text-sm">
          <p className="font-mincho tracking-[0.2em] text-gold-400">リンク</p>
          <a
            href={shop.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline w-fit text-paper/70 hover:text-gold-300"
          >
            Instagram
          </a>
          <a
            href={shop.gmapLinkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="link-underline w-fit text-paper/70 hover:text-gold-300"
          >
            Googleマップ
          </a>
          <Link href="/privacy" className="link-underline w-fit text-paper/70 hover:text-gold-300">
            プライバシーポリシー
          </Link>
          <a
            href={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/sitemap.xml`}
            className="link-underline w-fit text-paper/70 hover:text-gold-300"
          >
            サイトマップ
          </a>
        </nav>
      </div>

      <div className="border-t border-paper/5 py-6 text-center">
        <p className="font-serif-en text-[10px] tracking-[0.4em] text-paper/40">
          &copy; {new Date().getFullYear()} {shop.nameEn}. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
