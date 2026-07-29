/**
 * お品書きデータ。メニューの追加・変更・価格改定はこのファイルを編集する。
 * image は public/ 配下のパスを指定（差し替えは同名ファイルを置き換えるだけでよい）。
 */
export type MenuItem = {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  ingredients: string[];
  price: string; // 表示用文字列（時価などに対応するため文字列）
  priceValue?: number; // 構造化データ用（時価は undefined）
  image: string;
  alt: string;
};

export const menuItems: MenuItem[] = [
  {
    id: "kinryu-matcha",
    name: "金龍抹茶",
    nameEn: "KINRYU MATCHA",
    description: "深い旨みの宇治抹茶に和三盆の柔らかな甘み。金箔が静かに光る看板の一杯。",
    ingredients: ["宇治抹茶", "和三盆", "白玉", "金箔"],
    price: "1,800円",
    priceValue: 1800,
    image: "/images/menu-kinryu.webp",
    alt: "金龍抹茶 - 宇治抹茶と金箔をあしらった高級かき氷",
  },
  {
    id: "hakuryu-milk",
    name: "白龍みるく",
    nameEn: "HAKURYU MILK",
    description: "自家製練乳とマスカルポーネ。ひとつまみの塩が、ミルク氷の輪郭を際立たせる。",
    ingredients: ["自家製練乳", "マスカルポーネ", "塩", "ミルク氷"],
    price: "1,650円",
    priceValue: 1650,
    image: "/images/menu-hakuryu.webp",
    alt: "白龍みるく - 自家製練乳とマスカルポーネのかき氷",
  },
  {
    id: "kokuryu-hojicha",
    name: "黒龍ほうじ茶",
    nameEn: "KOKURYU HOJICHA",
    description: "香ばしい焙煎ほうじ茶に黒蜜ときなこ。求肥の余韻が長く続く、大人の一杯。",
    ingredients: ["焙煎ほうじ茶", "黒蜜", "きなこ", "求肥"],
    price: "1,700円",
    priceValue: 1700,
    image: "/images/menu-kokuryu.webp",
    alt: "黒龍ほうじ茶 - 焙煎ほうじ茶と黒蜜のかき氷",
  },
  {
    id: "kisetsu-kajitsu",
    name: "季節の果実氷",
    nameEn: "SEASONAL FRUITS",
    description: "その日いちばんの国産果実を、自家製果実蜜で。内容は仕入れにより変わります。",
    ingredients: ["旬の国産果実", "自家製果実蜜"],
    price: "時価",
    image: "/images/menu-kisetsu.webp",
    alt: "季節の果実氷 - 旬の国産果実を使ったかき氷",
  },
];

/** 季節限定メニュー（横スクロールの四章構成） */
export type SeasonalItem = {
  id: string;
  season: string;
  seasonEn: string;
  name: string;
  description: string;
  image: string;
  alt: string;
  /** 章ごとの背景・アクセント色 */
  bg: string;
  accent: string;
};

export const seasonalItems: SeasonalItem[] = [
  {
    id: "spring",
    season: "春",
    seasonEn: "SPRING",
    name: "桜と苺の淡雪",
    description: "桜葉の塩気と国産苺の酸味。春霞のように淡く積もる一杯。",
    image: "/images/season-spring.webp",
    alt: "春限定 桜と苺のかき氷",
    bg: "#151013",
    accent: "#e8b4c8",
  },
  {
    id: "summer",
    season: "夏",
    seasonEn: "SUMMER",
    name: "翡翠メロンと薄荷",
    description: "完熟メロンの果肉蜜に、ひと筋の薄荷。真夏の青い静けさ。",
    image: "/images/season-summer.webp",
    alt: "夏限定 メロンと薄荷のかき氷",
    bg: "#0d1416",
    accent: "#9fd8cb",
  },
  {
    id: "autumn",
    season: "秋",
    seasonEn: "AUTUMN",
    name: "焼芋と黒糖の錦",
    description: "蜜芋のペーストと黒糖蜜。焚き火のような香ばしさを氷に閉じ込めて。",
    image: "/images/season-autumn.webp",
    alt: "秋限定 焼芋と黒糖のかき氷",
    bg: "#161006",
    accent: "#d8a45b",
  },
  {
    id: "winter",
    season: "冬",
    seasonEn: "WINTER",
    name: "柚子と甘酒の白練",
    description: "米麹の甘酒と柚子の香り。凍てつく季節にこそ、温度のある氷を。",
    image: "/images/season-winter.webp",
    alt: "冬限定 柚子と甘酒のかき氷",
    bg: "#0c0f14",
    accent: "#e9e4d8",
  },
];
