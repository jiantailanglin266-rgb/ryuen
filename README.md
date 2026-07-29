# 氷菓飯店 龍園 — 公式Webサイト

新宿の高級かき氷専門店「氷菓飯店 龍園（HYOKA HANTEN RYUEN）」の公式サイト。
テーマは **「黒闇に浮かぶ、氷と黄金の龍」**。黒 × 金 × 白を基調に、3Dファーストビュー・スクロール演出・マイクロインタラクションを備えた没入型のブランドサイトです。

## 技術構成

| 分類 | 技術 |
|---|---|
| フレームワーク | Next.js 15（App Router）+ TypeScript |
| スタイリング | Tailwind CSS v4（`app/globals.css` の `@theme` でデザイントークン管理） |
| 3D | React Three Fiber + Three.js + Drei（カスタムGLSLシェーダー） |
| アニメーション | GSAP + ScrollTrigger / Framer Motion |
| スクロール | Lenis（慣性スクロール） |
| フォント | next/font（Shippori Mincho / Noto Sans JP / Cormorant Garamond） |
| 画像 | next/image（WebP / AVIF 自動最適化） |
| SEO | メタデータAPI・JSON-LD（WebSite / Restaurant+LocalBusiness / BreadcrumbList / FAQPage）・sitemap.xml・robots.txt |

## インストール

```bash
cd ryuen
npm install
```

## 開発サーバー起動

```bash
npm run dev
```

→ http://localhost:3220 で確認できます。

## 本番ビルド

```bash
npm run build
npm run start
```

## 指定画像（ヒーロー画像）の配置場所

ファーストビューの画像は以下に配置します（現在は自動生成の仮画像）。

```
public/images/hero-main.webp
```

**差し替え手順**: 同じファイル名で上書きするだけです。横長（1920×1280 程度、WebP推奨）が最適ですが、
3Dシーン側で cover フィット計算を行うため、縦横比が変わってもレイアウトは破綻しません。

## 画像差し替え手順（全画像）

すべての画像は `public/images/` にあります。同名ファイルで上書きすれば即反映されます。

| ファイル | 用途 | 推奨サイズ |
|---|---|---|
| `hero-main.webp` | ファーストビュー | 1920×1280 |
| `menu-*.webp` | お品書き4種 | 900×675（4:3） |
| `season-*.webp` | 季節限定4種 | 900×1200（3:4） |
| `gallery-01〜08.webp` | ギャラリー | 任意（`data/gallery.ts` の span で配置調整） |
| `space-main.webp` | 店舗空間 | 1000×1333（3:4） |
| `ogp.jpg` | OGP / SNSシェア | 1200×630 |

ファイル名やキャプションを変えたい場合は `data/menu.ts` / `data/gallery.ts` の `image` / `src` を編集してください。
仮画像を再生成したい場合は `npm run placeholders` を実行します。

## 店舗情報の変更手順

店舗情報はすべて **`data/shop.ts`** に集約されています。

- 住所・郵便番号 → `address`
- 営業時間・定休日 → `hours` / `openingHours`（構造化データ用）/ `holidays`
- 電話番号 → `tel` / `telLink`
- 支払い方法・席数 → `payment` / `seats`

ここを書き換えると、ヘッダー・フッター・店舗情報セクション・構造化データ（JSON-LD）にすべて反映されます。

## メニューの編集方法

- お品書き → `data/menu.ts` の `menuItems`（名前・説明・原材料・価格・画像パス）
- 季節限定 → 同ファイルの `seasonalItems`（章ごとの背景色 `bg` / アクセント色 `accent` も変更可）
- よくある質問 → `data/faq.ts`（FAQPage 構造化データにも自動反映）

価格は「時価」のような文字列にも対応しています（`priceValue` を省略すると構造化データから価格が外れます）。

## GoogleマップURLの変更方法

`.env.local` を作成して以下を設定します（`.env.example` 参照）。

```
NEXT_PUBLIC_GMAP_EMBED_URL=（Googleマップ「地図を埋め込む」の src URL）
NEXT_PUBLIC_GMAP_LINK_URL=（「地図で見る」ボタンの飛び先URL）
```

環境変数を使わない場合は `data/shop.ts` の `gmapEmbedUrl` / `gmapLinkUrl` のフォールバック値を直接書き換えても構いません。

## Instagram URLの変更方法

`data/shop.ts` の `instagramUrl` を書き換えてください。フッター・最終CTAに反映されます。

## 予約導線の変更方法

`data/shop.ts` の `reserveUrl` を予約システムのURLに書き換えてください（現在は店舗情報セクションへのページ内リンク `#reserve`）。

## 3D演出の無効化方法

- **自動フォールバック**: WebGL非対応環境・`prefers-reduced-motion` 有効時は自動で静止画 + CSSアニメーションに切り替わります。
- **手動で常時無効化**: `components/sections/Hero.tsx` の `const use3D = webgl === true && !reduced;` を `const use3D = false;` に変更（`FinalCta.tsx` も同様）。

## パフォーマンス調整方法

- **粒子数**: `components/three/HeroScene.tsx` の `iceCount` / `goldCount`（端末性能に応じ `lib/hooks.ts` の `useDeviceTier` が自動で削減）
- **解像度**: 各 Canvas の `dpr` プロパティ
- **3Dの遅延読み込み**: `next/dynamic`（`ssr: false`）で必要時のみロード。最終CTAはビューポート接近時にマウント
- **Lenis / GSAP**: reduced-motion 時は自動停止

## ディレクトリ構成

```
app/            レイアウト・ページ・SEO（sitemap / robots / icon）
components/
  layout/       Header / Footer / モバイル固定CTA
  sections/     Hero / Concept / Menu / SeasonalMenu / Craft / Gallery / Space / Access / Faq / FinalCta
  three/        HeroScene / CtaScene / IceParticles / IceShader（GLSL）
  ui/           GoldButton / SectionTitle / Reveal / CustomCursor / LoadingScreen
  providers/    SmoothScroll（Lenis）
  seo/          StructuredData（JSON-LD）
data/           shop.ts / menu.ts / gallery.ts / faq.ts（編集用データ）
scripts/        プレースホルダー画像生成
public/images/  画像一式
```
