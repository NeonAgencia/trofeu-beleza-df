import Image from "next/image";
import { CtaLink } from "@/components/cta-link";
import { LINK_INSCRICAO } from "@/lib/links";
import { HeroFog } from "@/components/decor/hero-fog";
import { HeroLines } from "@/components/decor/hero-lines";
import { HeroSpotlights } from "@/components/decor/hero-spotlights";
import { HeroTrophyVideo } from "@/components/decor/hero-trophy-video";
import moldura from "@/public/moldura.webp";

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
            Os Melhores do Ano da Beleza do DF
          </h1>
          <p className="font-sans text-lg text-branco-quente">
            Reconhecendo quem faz a beleza acontecer em todo o Distrito Federal.
          </p>
        </div>

        {/* Palco: troféu (vídeo) girando DENTRO da moldura dourada barroca. O vídeo
            preenche o vão central; a moldura (PNG transparente) cobre as bordas.
            Mobile: menor e ENTRE as frases. Desktop: coluna da direita. */}
        <div className="relative mx-auto w-full max-w-[240px] sm:max-w-[360px] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-[550px]">
          {/* Glow dourado muito sutil atrás da moldura, pra assentar no hero */}
          <div
            aria-hidden
            className="absolute inset-0 -z-10 scale-110"
            style={{
              background:
                "radial-gradient(closest-side, rgba(201,162,75,0.14), rgba(201,162,75,0) 78%)",
            }}
          />
          <div className="relative" style={{ aspectRatio: "1024 / 1536" }}>
            {/* Vão central — o vídeo do troféu (object-cover preenche; a moldura
                cobre as bordas, eliminando qualquer retângulo) */}
            <div
              className="absolute overflow-hidden"
              style={{ left: "23%", top: "20%", width: "54%", height: "62%" }}
            >
              <HeroTrophyVideo />
            </div>
            {/* Moldura dourada por cima */}
            <Image
              src={moldura}
              alt=""
              aria-hidden
              fill
              sizes="(max-width: 640px) 240px, (max-width: 1024px) 360px, 550px"
              className="pointer-events-none select-none object-contain"
              priority
            />
          </div>
        </div>

        {/* Texto — parte de baixo (descrição + botões) */}
        <div className="flex flex-col items-center gap-6 text-center lg:col-start-1 lg:row-start-2 lg:items-start lg:self-start lg:text-left">
          <p className="max-w-xl font-sans text-base leading-relaxed text-cinza-texto">
            Profissionais e estabelecimentos da beleza já podem se inscrever para
            representar sua Região Administrativa em uma premiação popular, online
            e feita para valorizar o talento local.
          </p>
          {/* Mobile: lado a lado, menores (flex-1). Desktop: tamanho aprovado. */}
          <div className="mt-2 flex w-full justify-center gap-3 lg:w-auto lg:justify-start lg:gap-4">
            <CtaLink
              href={LINK_INSCRICAO}
              size="lg"
              className="h-11 flex-1 px-3 text-sm sm:h-13 sm:flex-none sm:px-8 sm:text-base"
            >
              Se inscreva
            </CtaLink>
            <CtaLink
              href="#votacao"
              variant="secondary"
              size="lg"
              className="h-11 flex-1 px-3 text-sm sm:h-13 sm:flex-none sm:px-8 sm:text-base"
            >
              Vote no melhor
            </CtaLink>
          </div>
        </div>
      </div>

      {/* Holofotes dourados por cima — muito sutis, longe das bordas do vídeo */}
      <HeroSpotlights />
    </section>
  );
}
