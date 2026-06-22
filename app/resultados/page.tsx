import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CtaLink } from "@/components/cta-link";

export const metadata: Metadata = {
  title: "Resultados – Troféu Os Melhores do Ano · Beleza DF",
  description:
    "Os resultados do Troféu Os Melhores do Ano – Beleza DF serão divulgados após a apuração oficial, no calendário definido pela organização.",
};

export default function Resultados() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section className="relative isolate flex min-h-[70vh] items-center justify-center px-6 py-24">
          {/* Glow dourado do palco */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(201,162,75,0.18), rgba(201,162,75,0) 60%)",
            }}
          />
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-dourado">
              ✦ Em breve
            </span>
            <h1 className="bg-gradient-to-b from-[#F6E6AE] via-dourado-claro to-[#A9842F] bg-clip-text font-display text-4xl font-bold uppercase tracking-wide text-transparent sm:text-5xl">
              Resultados
            </h1>
            <p className="max-w-xl font-sans text-base leading-relaxed text-cinza-texto">
              Os resultados serão divulgados após a apuração oficial, no
              calendário definido pela organização.
            </p>
            <CtaLink href="/" variant="secondary" className="mt-2">
              Voltar ao início
            </CtaLink>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
