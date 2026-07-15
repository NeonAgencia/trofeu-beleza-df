import { CtaLink } from "@/components/cta-link";
import { LINK_INSCRICAO } from "@/lib/links";
import { HeroFog } from "@/components/decor/hero-fog";
import { HeroLines } from "@/components/decor/hero-lines";
import { HeroSpotlights } from "@/components/decor/hero-spotlights";
import { HeroTrophy } from "@/components/decor/hero-trophy";

export function Hero() {
  return (
    <section
      id="topo"
      className="relative isolate overflow-hidden border-b border-border bg-black px-6 pb-16 pt-14 sm:pb-20 sm:pt-16"
    >
      {/* Névoa/atmosfera do palco (atrás de tudo) */}
      <HeroFog />
      {/* Textura A — filetes dourados varrendo o fundo do palco (sutil) */}
      <HeroLines />

      {/* Mobile: empilha na ordem chamada → troféu → descrição → botões.
          Desktop (lg): texto à esquerda (2 linhas) + troféu à direita — igual ao aprovado. */}
      <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-y-6 lg:grid-cols-2 lg:gap-x-16 lg:gap-y-6">
        {/* Texto — parte de cima (eyebrow + título + chamada) */}
        <div className="flex flex-col items-center gap-6 text-center lg:col-start-1 lg:row-start-1 lg:items-start lg:self-end lg:text-left">
          <span className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-dourado">
            ✦ Troféu · Beleza DF
          </span>
          <h1 className="bg-gradient-to-b from-[#F6E6AE] via-dourado-claro to-[#A9842F] bg-clip-text pb-[0.12em] font-display text-4xl font-bold uppercase leading-[1.12] tracking-wide text-transparent sm:text-5xl lg:text-6xl">
            OS MELHORES DO ANO DA BELEZA DO DF
          </h1>
          <p className="font-sans text-lg text-branco-quente">
            Reconhecimento aos profissionais e estabelecimentos que movimentam o setor da beleza em todo o Distrito Federal.
          </p>
        </div>

        {/* Palco: troféu silhouette vetorizado dourado no pedestal */}
        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 w-full">
          <HeroTrophy />
        </div>

        {/* Texto — parte de baixo (descrição + botões) */}
        <div className="flex flex-col items-center gap-6 text-center lg:col-start-1 lg:row-start-2 lg:items-start lg:self-start lg:text-left">
          <p className="max-w-xl font-sans text-base leading-relaxed text-cinza-texto">
            Profissionais e empresas da beleza podem se inscrever para representar sua Região Administrativa em uma premiação popular, online e transparente, criada para valorizar talentos locais.
          </p>
          {/* Mobile: lado a lado, menores (flex-1). Desktop: tamanho aprovado. */}
          <div className="mt-2 flex w-full justify-center gap-3 lg:w-auto lg:justify-start lg:gap-4">
            <CtaLink
              href={LINK_INSCRICAO}
              size="lg"
              className="h-11 flex-1 px-3 text-sm sm:h-13 sm:flex-none sm:px-8 sm:text-base"
            >
              FAÇA SUA INSCRIÇÃO
            </CtaLink>
            <CtaLink
              href="/votar"
              variant="secondary"
              size="lg"
              className="h-11 flex-1 px-3 text-sm sm:h-13 sm:flex-none sm:px-8 sm:text-base"
            >
              VOTE NO MELHOR
            </CtaLink>
          </div>
        </div>
      </div>

      {/* Holofotes dourados por cima — muito sutis, longe das bordas do vídeo */}
      <HeroSpotlights />
    </section>
  );
}
