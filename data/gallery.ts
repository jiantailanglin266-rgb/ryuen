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
    alt: "削りたてのかき氷に金箔をのせる仕上げの様子",
    caption: "仕上げの金箔",
    captionEn: "FINISHING",
    span: "large",
  },
  {
    id: "g2",
    src: "/images/gallery-02.webp",
    alt: "黒を基調とした店内とカウンター席",
    caption: "静謐な店内",
    captionEn: "INTERIOR",
    span: "tall",
  },
  {
    id: "g3",
    src: "/images/gallery-03.webp",
    alt: "透明度の高い氷の塊",
    caption: "厳選した氷",
    captionEn: "ICE",
    span: "normal",
  },
  {
    id: "g4",
    src: "/images/gallery-04.webp",
    alt: "旬の果実と自家製蜜の仕込み",
    caption: "蜜の仕込み",
    captionEn: "SYRUP",
    span: "normal",
  },
  {
    id: "g5",
    src: "/images/gallery-05.webp",
    alt: "氷を削る職人の手元",
    caption: "削りの所作",
    captionEn: "CRAFT",
    span: "wide",
  },
  {
    id: "g6",
    src: "/images/gallery-06.webp",
    alt: "選び抜かれた器に盛られたかき氷",
    caption: "器との調和",
    captionEn: "VESSEL",
    span: "normal",
  },
  {
    id: "g7",
    src: "/images/gallery-07.webp",
    alt: "間接照明に照らされた店舗入口",
    caption: "入口の灯り",
    captionEn: "ENTRANCE",
    span: "tall",
  },
  {
    id: "g8",
    src: "/images/gallery-08.webp",
    alt: "季節の果実氷の盛り付け",
    caption: "季節の一杯",
    captionEn: "SEASONAL",
    span: "normal",
  },
];
