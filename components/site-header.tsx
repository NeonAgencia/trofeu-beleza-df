import Image from "next/image";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LINK_INSCRICAO } from "@/lib/links";
import logoValer from "@/public/logo-valer-mono.png";

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
        <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 sm:w-8 sm:h-8"
          >
            <defs>
              <linearGradient id="headerGold" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#F6E6AE" />
                <stop offset="0.5" stopColor="#E8C97A" />
                <stop offset="1" stopColor="#C9A24B" />
              </linearGradient>
            </defs>
            <path
              fill="url(#headerGold)"
              d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
            />
          </svg>
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
            <Image
              src={logoValer}
              alt="Instituto Valer"
              className="h-10 w-auto opacity-80"
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
