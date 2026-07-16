import { CtaLink } from "@/components/cta-link";
import { LINK_INSCRICAO } from "@/lib/links";
import { HeroLines } from "@/components/decor/hero-lines";

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32">
      <HeroLines />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        {/* Troféu Dourado no cabeçalho do CTA */}
        <img
          src="/trofeu-hero-clean.png"
          alt="Troféu oficial Os Melhores do Ano"
          className="h-28 w-auto object-contain select-none pointer-events-none mb-2 drop-shadow-[0_4px_20px_rgba(201,162,75,0.2)]"
        />
        <h2 className="font-display text-3xl font-bold uppercase tracking-wider text-branco-quente sm:text-5xl leading-tight">
          SUA TRAJETÓRIA MERECE SER VISTA.
        </h2>
        <p className="max-w-xl font-sans text-base leading-relaxed text-cinza-texto">
          Faça sua inscrição, represente sua Região Administrativa e participe
          desse movimento de valorização da beleza no DF.
        </p>
        <p className="font-display text-sm sm:text-base font-bold uppercase tracking-widest text-dourado">
          PARTICIPE, REPRESENTE SUA REGIÃO E VALORIZE SUA TRAJETÓRIA
        </p>
        <CtaLink href={LINK_INSCRICAO} size="lg" className="mt-2">
          FAÇA SUA INSCRIÇÃO
        </CtaLink>
      </div>
    </section>
  );
}
