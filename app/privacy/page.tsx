import type { Metadata } from "next";
import Link from "next/link";
import { shop } from "@/data/shop";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "氷菓飯店 龍園のプライバシーポリシーです。",
  alternates: { canonical: `${shop.siteUrl}/privacy/` },
};

const SECTIONS = [
  {
    title: "1. 個人情報の取得について",
    body: "当店は、ご予約・お問い合わせの際に、お名前、電話番号、メールアドレス等の個人情報を取得する場合がございます。取得した情報は、適法かつ公正な手段により取得いたします。",
  },
  {
    title: "2. 個人情報の利用目的",
    body: "取得した個人情報は、ご予約の管理・確認のご連絡、お問い合わせへの回答、サービス向上のための分析にのみ利用し、それ以外の目的では利用いたしません。",
  },
  {
    title: "3. 個人情報の第三者提供",
    body: "法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供することはございません。",
  },
  {
    title: "4. アクセス解析について",
    body: "当サイトでは、サービス向上のためアクセス解析ツールを利用する場合がございます。これらのツールはCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。",
  },
  {
    title: "5. お問い合わせ窓口",
    body: `本ポリシーに関するお問い合わせは、店舗（${shop.tel}）までご連絡ください。`,
  },
];

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink-950 px-6 py-24 md:px-10">
      <div className="mx-auto max-w-3xl">
        <p className="font-serif-en text-xs tracking-[0.5em] text-gold-400">
          PRIVACY POLICY
        </p>
        <h1 className="mt-4 font-mincho text-3xl tracking-[0.15em] text-paper">
          プライバシーポリシー
        </h1>
        <div className="gold-line mt-6 w-16 opacity-70" aria-hidden="true" />

        <div className="mt-12 flex flex-col gap-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="font-mincho text-lg tracking-[0.1em] text-gold-300">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-[2.2] text-paper/75">
                {section.body}
              </p>
            </section>
          ))}
        </div>

        <p className="mt-16 text-xs text-paper/40">制定日：2026年7月29日</p>

        <Link
          href="/"
          className="link-underline mt-12 inline-block font-mincho text-sm tracking-[0.2em] text-gold-300"
        >
          トップページへ戻る
        </Link>
      </div>
    </main>
  );
}
