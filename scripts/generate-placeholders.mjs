/**
 * プレースホルダー画像生成スクリプト。
 * 実写画像が用意できるまでの仮画像（黒×金×氷の抽象ビジュアル）を
 * public/images/ に生成する。実画像が用意できたら同名ファイルで上書きするだけでよい。
 *
 * 実行: npm run placeholders
 */
import sharp from "sharp";
import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "images");
mkdirSync(outDir, { recursive: true });

/** 抽象的な氷と金のSVGを組み立てる */
function makeSvg({ w, h, label, en, hueA = "#0a0a0a", hueB = "#111111", accent = "#c6a15b", ice = "#cfe4f2", seed = 1 }) {
  const rand = (() => {
    let s = seed * 9301 + 49297;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  })();

  // 氷片（多角形）をランダム配置
  let shards = "";
  for (let i = 0; i < 14; i++) {
    const cx = rand() * w;
    const cy = rand() * h;
    const size = 30 + rand() * (Math.min(w, h) * 0.18);
    const rot = Math.floor(rand() * 360);
    const op = 0.03 + rand() * 0.08;
    shards += `<polygon points="0,${-size} ${size * 0.7},${size * 0.5} ${-size * 0.6},${size * 0.6}"
      transform="translate(${cx},${cy}) rotate(${rot})"
      fill="${ice}" opacity="${op.toFixed(3)}"/>`;
  }

  // 金の曲線（龍の抽象）
  let curves = "";
  for (let i = 0; i < 3; i++) {
    const y0 = h * (0.25 + rand() * 0.5);
    const amp = h * (0.08 + rand() * 0.15);
    curves += `<path d="M ${-w * 0.1} ${y0} C ${w * 0.25} ${y0 - amp}, ${w * 0.45} ${y0 + amp}, ${w * 0.7} ${y0 - amp * 0.5} S ${w * 1.05} ${y0 + amp * 0.3}, ${w * 1.1} ${y0 - amp}"
      fill="none" stroke="${accent}" stroke-width="${1 + rand() * 1.5}" opacity="${(0.1 + rand() * 0.15).toFixed(3)}"/>`;
  }

  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <radialGradient id="bg" cx="35%" cy="30%" r="90%">
      <stop offset="0%" stop-color="${hueB}"/>
      <stop offset="55%" stop-color="${hueA}"/>
      <stop offset="100%" stop-color="#050505"/>
    </radialGradient>
    <radialGradient id="glow" cx="70%" cy="65%" r="45%">
      <stop offset="0%" stop-color="${ice}" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="${ice}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="goldglow" cx="30%" cy="75%" r="40%">
      <stop offset="0%" stop-color="${accent}" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#bg)"/>
  <rect width="${w}" height="${h}" fill="url(#glow)"/>
  <rect width="${w}" height="${h}" fill="url(#goldglow)"/>
  ${shards}
  ${curves}
  <rect x="${w * 0.05}" y="${h * 0.05}" width="${w * 0.9}" height="${h * 0.9}" fill="none" stroke="${accent}" stroke-opacity="0.25" stroke-width="1"/>
  ${en ? `<text x="50%" y="${h * 0.46}" font-family="Georgia, serif" font-size="${Math.min(w, h) * 0.045}" letter-spacing="${Math.min(w, h) * 0.012}" fill="${accent}" fill-opacity="0.75" text-anchor="middle">${en}</text>` : ""}
  ${label ? `<text x="50%" y="${h * 0.55}" font-family="'Yu Mincho', 'Hiragino Mincho ProN', serif" font-size="${Math.min(w, h) * 0.075}" letter-spacing="${Math.min(w, h) * 0.02}" fill="#f8f6f0" fill-opacity="0.85" text-anchor="middle">${label}</text>` : ""}
</svg>`);
}

const jobs = [
  // ヒーロー（差し替え前提の仮画像）
  { file: "hero-main.webp", w: 1920, h: 1280, label: "氷菓飯店 龍園", en: "HYOKA HANTEN RYUEN", seed: 7 },
  // お品書き
  { file: "menu-kinryu.webp", w: 900, h: 675, label: "金龍抹茶", en: "KINRYU MATCHA", hueA: "#0c1008", hueB: "#14180e", seed: 11 },
  { file: "menu-hakuryu.webp", w: 900, h: 675, label: "白龍みるく", en: "HAKURYU MILK", hueA: "#101012", hueB: "#18181c", seed: 12 },
  { file: "menu-kokuryu.webp", w: 900, h: 675, label: "黒龍ほうじ茶", en: "KOKURYU HOJICHA", hueA: "#100c08", hueB: "#181209", seed: 13 },
  { file: "menu-kisetsu.webp", w: 900, h: 675, label: "季節の果実氷", en: "SEASONAL FRUITS", hueA: "#120a0c", hueB: "#1a1013", seed: 14 },
  // 季節限定
  { file: "season-spring.webp", w: 900, h: 1200, label: "桜と苺の淡雪", en: "SPRING", hueA: "#151013", hueB: "#1d1418", accent: "#e8b4c8", seed: 21 },
  { file: "season-summer.webp", w: 900, h: 1200, label: "翡翠メロンと薄荷", en: "SUMMER", hueA: "#0d1416", hueB: "#131b1e", accent: "#9fd8cb", seed: 22 },
  { file: "season-autumn.webp", w: 900, h: 1200, label: "焼芋と黒糖の錦", en: "AUTUMN", hueA: "#161006", hueB: "#1e160a", accent: "#d8a45b", seed: 23 },
  { file: "season-winter.webp", w: 900, h: 1200, label: "柚子と甘酒の白練", en: "WINTER", hueA: "#0c0f14", hueB: "#12161c", accent: "#e9e4d8", seed: 24 },
  // ギャラリー
  { file: "gallery-01.webp", w: 1200, h: 1200, label: "仕上げの金箔", en: "FINISHING", seed: 31 },
  { file: "gallery-02.webp", w: 900, h: 1400, label: "静謐な店内", en: "INTERIOR", seed: 32 },
  { file: "gallery-03.webp", w: 900, h: 700, label: "厳選した氷", en: "ICE", seed: 33 },
  { file: "gallery-04.webp", w: 900, h: 700, label: "蜜の仕込み", en: "SYRUP", seed: 34 },
  { file: "gallery-05.webp", w: 1400, h: 800, label: "削りの所作", en: "CRAFT", seed: 35 },
  { file: "gallery-06.webp", w: 900, h: 700, label: "器との調和", en: "VESSEL", seed: 36 },
  { file: "gallery-07.webp", w: 900, h: 1400, label: "入口の灯り", en: "ENTRANCE", seed: 37 },
  { file: "gallery-08.webp", w: 900, h: 700, label: "季節の一杯", en: "SEASONAL", seed: 38 },
  // 店舗空間
  { file: "space-main.webp", w: 1000, h: 1333, label: "店舗空間", en: "SPACE", seed: 41 },
];

for (const job of jobs) {
  const svg = makeSvg(job);
  await sharp(svg).webp({ quality: 82 }).toFile(join(outDir, job.file));
  console.log(`generated: ${job.file}`);
}

// OGP（JPG 1200x630）
const ogpSvg = makeSvg({
  w: 1200,
  h: 630,
  label: "氷菓飯店 龍園",
  en: "HYOKA HANTEN RYUEN — SHINJUKU, TOKYO",
  seed: 51,
});
await sharp(ogpSvg).jpeg({ quality: 88 }).toFile(join(outDir, "ogp.jpg"));
console.log("generated: ogp.jpg");

console.log("\nすべてのプレースホルダー画像を生成しました。");
console.log("実画像が用意できたら public/images/ の同名ファイルを上書きしてください。");
