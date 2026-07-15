import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LINK_INSCRICAO } from "@/lib/links";

const NAV = [
  { label: "Home", href: "/" },
  { label: "O Prêmio", href: "/#o-premio" },
  { label: "Categorias", href: "/#categorias" },
  { label: "Regulamento", href: "/regulamento" },
  { label: "Resultados", href: "/resultados" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-preto/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        {/* Lado Esquerdo: Silhouette Logo + Nome Oficial */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <img
            src="/logo-header-clean.png"
            alt="Logo"
            className="h-9 w-9 sm:h-10 sm:w-10 object-contain select-none pointer-events-none"
          />
          <div className="flex flex-col">
            <span className="font-display text-[9px] sm:text-xs font-bold uppercase tracking-[0.16em] text-dourado leading-tight">
              TROFÉU
            </span>
            <span className="font-display text-[10px] sm:text-sm font-bold uppercase tracking-[0.18em] text-branco-quente leading-tight">
              OS MELHORES DO ANO
            </span>
          </div>
        </Link>

        {/* Centro: Links de Navegação */}
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

        {/* Lado Direito: Logo Valer + Botões */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link href="/" className="hidden md:block hover:opacity-80 transition-opacity mr-2">
            <img
              src="/logo-valer-mono.png"
              alt="Instituto Valer"
              className="h-9 w-auto opacity-80 select-none pointer-events-none"
            />
          </Link>

          <div className="flex items-center gap-1.5 sm:gap-3">
            <CtaLink 
              href={LINK_INSCRICAO}
              className="h-8 px-2 sm:h-11 sm:px-6 text-[10px] sm:text-sm"
            >
              Inscreva-se
            </CtaLink>
            <CtaLink
              href="/votar"
              variant="secondary"
              className="h-8 px-2 sm:h-11 sm:px-6 text-[10px] sm:text-sm"
            >
              VOTE NO MELHOR
            </CtaLink>
          </div>
        </div>
      </div>
    </header>
  );
}
