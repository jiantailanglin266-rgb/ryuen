/**
 * 店舗情報の一元管理ファイル。
 * 住所・電話番号・営業時間・SNSなど、店舗に関する情報はすべてここを編集する。
 */
export const shop = {
  name: "氷菓飯店 龍園",
  nameEn: "HYOKA HANTEN RYUEN",
  tagline: "新宿に、氷の余韻を。",
  description:
    "新宿のかき氷専門店「氷菓飯店 龍園」。旬の果実、自家製蜜、厳選した氷を使った、繊細で美しいかき氷をご提供します。",

  // ---- 所在地（仮テキスト。確定後に書き換える）----
  address: {
    postalCode: "160-0022",
    prefecture: "東京都",
    city: "新宿区",
    street: "新宿◯丁目◯-◯（住所は後日確定）",
    building: "◯◯ビル 1F",
  },

  // ---- 営業情報 ----
  hours: "12:00〜20:00",
  openingHours: "Mo-Su 12:00-20:00", // 構造化データ用
  holidays: "不定休",
  payment: "現金、クレジットカード、各種キャッシュレス決済",
  seats: "カウンター・テーブル 全18席（仮）",

  // ---- 連絡先（仮）----
  tel: "03-0000-0000",
  telLink: "tel:0300000000",

  // ---- 外部リンク ----
  reserveUrl: "#reserve", // 予約システム導入後にURLへ差し替え
  instagramUrl: "https://www.instagram.com/",
  // Googleマップは環境変数を優先し、未設定時はこの値を使う
  gmapEmbedUrl:
    process.env.NEXT_PUBLIC_GMAP_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.0!2d139.7005!3d35.6900!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z5paw5a6_!5e0!3m2!1sja!2sjp!4v1700000000000",
  gmapLinkUrl:
    process.env.NEXT_PUBLIC_GMAP_LINK_URL ||
    "https://www.google.com/maps/search/?api=1&query=%E6%9D%B1%E4%BA%AC%E9%83%BD%E6%96%B0%E5%AE%BF%E5%8C%BA",

  // ---- サイト設定 ----
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://ryuen.example.com",
  geo: { latitude: 35.69, longitude: 139.7005 }, // 仮座標（新宿駅周辺）
} as const;

export type Shop = typeof shop;
