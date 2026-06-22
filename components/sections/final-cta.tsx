import { CtaLink } from "@/components/cta-link";
import { HeroLines } from "@/components/decor/hero-lines";

export function FinalCta() {
  return (
    <section className="relative isolate overflow-hidden px-6 py-24 sm:py-32">
      <HeroLines />
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <h2 className="font-display text-3xl font-bold uppercase tracking-wide text-branco-quente sm:text-5xl">
          Sua trajetória merece ser vista.
        </h2>
        <p className="max-w-xl font-sans text-base leading-relaxed text-cinza-texto">
          Faça sua inscrição, represente sua Região Administrativa e participe
          desse movimento de valorização da beleza no DF.
        </p>
        <p className="font-display text-lg uppercase tracking-wide text-dourado">
          Concorra. Participe. Destaque sua trajetória.
        </p>
        <CtaLink href="#inscricao" size="lg" className="mt-2">
          Faça sua inscrição
        </CtaLink>
      </div>
    </section>
  );
}
