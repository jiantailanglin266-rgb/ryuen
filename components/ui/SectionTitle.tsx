import Reveal from "@/components/ui/Reveal";

type Props = {
  en: string;
  ja: string;
  align?: "left" | "center";
  id?: string;
};

/** セクション見出し（英字ラベル + 明朝日本語 + 金線） */
export default function SectionTitle({ en, ja, align = "left", id }: Props) {
  const alignCls = align === "center" ? "items-center text-center" : "items-start";
  return (
    <Reveal>
      <div className={`flex flex-col gap-4 ${alignCls}`}>
        <p className="font-serif-en text-xs tracking-[0.5em] text-gold-400" aria-hidden="true">
          {en}
        </p>
        <h2
          id={id}
          className="font-mincho text-3xl font-medium leading-snug tracking-[0.14em] text-paper md:text-4xl"
        >
          {ja}
        </h2>
        <div className="gold-line w-16 opacity-70" aria-hidden="true" />
      </div>
    </Reveal>
  );
}
