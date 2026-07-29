import { shop } from "@/data/shop";
import SectionTitle from "@/components/ui/SectionTitle";
import Reveal from "@/components/ui/Reveal";
import GoldButton from "@/components/ui/GoldButton";

/** Googleマップ埋め込み（URL は data/shop.ts / 環境変数で変更可能） */
function MapEmbed() {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden border border-gold-500/15 md:aspect-auto md:h-full md:min-h-[420px]">
      <iframe
        src={shop.gmapEmbedUrl}
        title="氷菓飯店 龍園 の地図"
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0 h-full w-full border-0 opacity-90 [filter:grayscale(0.9)_contrast(1.05)_brightness(0.9)]"
      />
    </div>
  );
}

const INFO_ROWS: { label: string; value: string }[] = [
  {
    label: "所在地",
    value: `〒${shop.address.postalCode} ${shop.address.prefecture}${shop.address.city}${shop.address.street} ${shop.address.building}`,
  },
  { label: "営業時間", value: shop.hours },
  { label: "定休日", value: shop.holidays },
  { label: "お支払い", value: shop.payment },
  { label: "お席", value: shop.seats },
  { label: "お電話", value: shop.tel },
];

export default function Access() {
  return (
    <section
      id="access"
      aria-labelledby="access-heading"
      className="relative bg-ink-950 py-32 md:py-44"
    >
      <div className="mist-layer" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <SectionTitle en="ACCESS" ja="店舗情報" id="access-heading" />

        <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
          {/* 情報テーブル */}
          <Reveal>
            <div>
              <h3 className="font-mincho text-2xl tracking-[0.25em] text-paper">
                {shop.name}
              </h3>
              <p className="mt-2 font-serif-en text-[10px] tracking-[0.45em] text-gold-500">
                {shop.nameEn}
              </p>

              <dl className="mt-10 flex flex-col">
                {INFO_ROWS.map((row) => (
                  <div
                    key={row.label}
                    className="grid grid-cols-[6rem_1fr] gap-4 border-b border-paper/8 py-5 text-sm"
                  >
                    <dt className="font-mincho tracking-[0.2em] text-gold-400">
                      {row.label}
                    </dt>
                    <dd className="leading-relaxed text-paper/80">
                      {row.label === "お電話" ? (
                        <a href={shop.telLink} className="link-underline hover:text-gold-300">
                          {row.value}
                        </a>
                      ) : (
                        row.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>

              <div id="reserve" className="mt-10 flex flex-wrap gap-4 scroll-mt-28">
                <GoldButton href={shop.reserveUrl} variant="solid">
                  ご予約はこちら
                </GoldButton>
                <GoldButton href={shop.gmapLinkUrl} external>
                  Googleマップで見る
                </GoldButton>
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-paper/40">
                ※ オンライン予約は準備中です。当面はお電話にて承ります。
              </p>
            </div>
          </Reveal>

          {/* 地図 */}
          <Reveal delay={0.2}>
            <MapEmbed />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
