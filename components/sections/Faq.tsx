"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqItems } from "@/data/faq";
import SectionTitle from "@/components/ui/SectionTitle";
import Reveal from "@/components/ui/Reveal";

/** よくある質問（滑らかな開閉のアコーディオン） */
export default function Faq() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section
      id="faq"
      aria-labelledby="faq-heading"
      className="relative bg-ink-900 py-32 md:py-44"
    >
      <div className="mist-layer" aria-hidden="true" />
      <div className="relative mx-auto max-w-3xl px-6 md:px-10">
        <SectionTitle en="FAQ" ja="よくある質問" id="faq-heading" align="center" />

        <div className="mt-16 flex flex-col">
          {faqItems.map((item, i) => {
            const isOpen = openId === item.id;
            return (
              <Reveal key={item.id} delay={i * 0.06}>
                <div className="border-b border-paper/10">
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`${item.id}-panel`}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left"
                  >
                    <span className="flex items-baseline gap-5">
                      <span
                        aria-hidden="true"
                        className="font-serif-en text-xs tracking-[0.2em] text-gold-500"
                      >
                        Q
                      </span>
                      <span className="font-mincho text-base tracking-[0.1em] text-paper transition-colors duration-300 group-hover:text-gold-300 md:text-lg">
                        {item.question}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="relative flex h-8 w-8 shrink-0 items-center justify-center border border-gold-500/40"
                    >
                      <span className="absolute h-px w-3 bg-gold-400" />
                      <span
                        className={`absolute h-3 w-px bg-gold-400 transition-transform duration-500 [transition-timing-function:var(--ease-silk)] ${
                          isOpen ? "scale-y-0" : "scale-y-100"
                        }`}
                      />
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`${item.id}-panel`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="flex gap-5 pb-7 pl-0 pr-4 text-sm leading-[2.2] text-paper/70">
                          <span
                            aria-hidden="true"
                            className="font-serif-en text-xs tracking-[0.2em] text-paper/40"
                          >
                            A
                          </span>
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
