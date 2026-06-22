import Image from "next/image";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import logoEscolas from "@/public/logo-escolas-mono.png";
import logoValer from "@/public/logo-valer-mono.png";

const NAV = [
  { label: "O Prêmio", href: "#o-premio" },
  { label: "Como Funciona", href: "#como-funciona" },
  { label: "Categorias", href: "#categorias" },
  { label: "Premiação", href: "#premiacao" },
  { label: "Regulamento", href: "#regulamento" },
  { label: "Resultados", href: "/resultados" },
];

// Header em duas camadas:
// - Faixa institucional (logos): FIXA no topo (sticky), só desktop. Não acompanha
//   o scroll — fica sempre visível.
// - Linha principal (Troféu + menu + botões): rola normalmente com a página e sai
//   de vista ao rolar.
export function SiteHeader() {
  return (
    <>
      {/* Faixa de logos — fixa no topo (desktop). Escolas à esquerda, Valer à direita. */}
      <div className="sticky top-0 z-50 hidden border-b border-border/50 bg-preto/95 backdrop-blur lg:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2">
          {/* Esquerda: Escolas de Sucesso, com "Venha ser" integrado ao lockup */}
          <div className="flex flex-col items-start gap-1 leading-none">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-dourado/90">
              Venha ser
            </span>
            <Image
              src={logoEscolas}
              alt="Escolas de Sucesso"
              className="h-14 w-auto"
            />
          </div>

          {/* Centro: rótulo institucional */}
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-cinza-texto/60">
            Uma realização
          </span>

          {/* Direita: Instituto Valer */}
          <Image src={logoValer} alt="Instituto Valer" className="h-14 w-auto" />
        </div>
      </div>

      {/* Linha principal — rola normalmente com a página */}
      <header className="relative z-40 border-b border-border bg-preto/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href="#topo"
            className="whitespace-nowrap font-display text-sm font-bold uppercase tracking-[0.12em] text-dourado"
          >
            {/* [placeholder de logo] */}
            Troféu · Beleza DF
          </Link>

          <nav className="hidden items-center gap-5 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap font-sans text-sm text-cinza-texto transition-colors hover:text-dourado"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Botões de ação. No mobile estreito só cabe o primário;
              o secundário entra a partir de sm (o hero já oferece ambos). */}
          <div className="flex items-center gap-2">
            <CtaLink href="#inscricao">Se inscreva</CtaLink>
            <CtaLink
              href="#votacao"
              variant="secondary"
              className="hidden sm:inline-flex"
            >
              Vote no melhor
            </CtaLink>
          </div>
        </div>
      </header>
    </>
  );
}
