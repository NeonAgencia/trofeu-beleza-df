import Image from "next/image";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LINK_INSCRICAO } from "@/lib/links";
import logoEscolas from "@/public/logo-escolas-mono.png";
import logoValer from "@/public/logo-valer-mono.png";

const NAV = [
  { label: "Home", href: "/" },
  { label: "O Prêmio", href: "/#o-premio" },
  { label: "Categorias", href: "/#categorias" },
  { label: "Regulamento", href: "/regulamento" },
  { label: "Resultados", href: "/resultados" },
];

// Header em duas camadas:
// - Faixa institucional (logos): FIXA no topo (position: fixed), só desktop. Sempre
//   visível ao rolar. Um spacer reserva a altura dela pra não cobrir o conteúdo.
// - Linha principal (Troféu + menu + botões): rola normalmente com a página e sai
//   de vista ao rolar.
export function SiteHeader() {
  return (
    <>
      {/* Faixa de logos — FIXA no topo (desktop). Escolas à esquerda, Valer à direita. */}
      <div className="fixed inset-x-0 top-0 z-50 hidden border-b border-border/50 bg-preto/95 backdrop-blur lg:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-2">
          {/* Esquerda: Escolas de Sucesso, com "Venha ser" integrado ao lockup */}
          <Link href="/" className="flex flex-col items-start gap-1 leading-none hover:opacity-80 transition-opacity">
            <span className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-dourado/90">
              Venha ser
            </span>
            <Image
              src={logoEscolas}
              alt="Escolas de Sucesso"
              className="h-14 w-auto"
            />
          </Link>

          {/* Centro: rótulo institucional */}
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-cinza-texto/60">
            Uma realização
          </span>

          {/* Direita: Instituto Valer */}
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Image src={logoValer} alt="Instituto Valer" className="h-14 w-auto" />
          </Link>
        </div>
      </div>

      {/* Spacer — reserva a altura da faixa fixa (desktop), evita sobreposição */}
      <div aria-hidden className="hidden h-[94px] lg:block" />

      {/* Linha principal — acompanha o scroll (sticky) */}
      <header className="sticky top-0 lg:top-[94px] z-40 border-b border-border bg-preto/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
          <Link
            href="/"
            className="whitespace-nowrap font-display text-[10px] sm:text-sm font-bold uppercase tracking-[0.08em] sm:tracking-[0.12em] text-dourado"
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

          {/* Botões de ação. Ambos visíveis no celular de forma compacta e responsiva. */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <CtaLink 
              href={LINK_INSCRICAO}
              className="h-8 px-2 sm:h-11 sm:px-6 text-[10px] sm:text-sm"
            >
              Se inscreva
            </CtaLink>
            <CtaLink
              href="/votar"
              variant="secondary"
              className="h-8 px-2 sm:h-11 sm:px-6 text-[10px] sm:text-sm"
            >
              Vote no melhor
            </CtaLink>
          </div>
        </div>
      </header>
    </>
  );
}
