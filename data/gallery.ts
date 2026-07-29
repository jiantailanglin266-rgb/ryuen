/**
 * ギャラリー画像データ。画像を差し替える場合は public/images/ の同名ファイルを
 * 置き換えるか、このファイルの src を変更する。
 * span: 非対称グリッドの大きさ（"large" | "tall" | "wide" | "normal"）
 */
export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  captionEn: string;
  span: "large" | "tall" | "wide" | "normal";
};

export const galleryItems: GalleryItem[] = [
  {
    id: "g1",
    src: "/images/gallery-01.webp",
    alt: "金襴の敷物にのせた桃のかき氷と生クリーム",
    caption: "季節の一杯",
    captionEn: "SEASONAL",
    span: "large",
  },
  {
    id: "g2",
    src: "/images/gallery-02.webp",
    alt: "店主が両手で差し出す大きなかき氷",
    caption: "店主のもてなし",
    captionEn: "OMOTENASHI",
    span: "tall",
  },
  {
    id: "g3",
    src: "/images/gallery-03.webp",
    alt: "キウイとりんご、ベリーソースのかき氷",
    caption: "果実の彩り",
    captionEn: "FRUITS",
    span: "normal",
  },
  {
    id: "g4",
    src: "/images/gallery-04.webp",
    alt: "苺と桜、自家製蜜をたっぷりかけたかき氷",
    caption: "自家製蜜",
    captionEn: "SYRUP",
    span: "normal",
  },
  {
    id: "g5",
    src: "/images/gallery-05.webp",
    alt: "氷の旗が揺れる店舗入口",
    caption: "店舗入口",
    captionEn: "ENTRANCE",
    span: "wide",
  },
  {
    id: "g6",
    src: "/images/gallery-06.webp",
    alt: "チョコレートとピスタチオを重ねた渾身のかき氷",
    caption: "渾身の一杯",
    captionEn: "SIGNATURE",
    span: "normal",
  },
  {
    id: "g7",
    src: "/images/gallery-07.webp",
    alt: "静謐な店内のイメージ（写真は準備中）",
    caption: "静謐な店内",
    captionEn: "INTERIOR",
    span: "tall",
  },
  {
    id: "g8",
    src: "/images/gallery-08.webp",
    alt: "厳選した氷のイメージ（写真は準備中）",
    caption: "厳選した氷",
    captionEn: "ICE",
    span: "normal",
  },
];
