import Image from "next/image";
import Link from "next/link";
import logoEscolas from "@/public/logo-escolas-mono.png";
import logoValer from "@/public/logo-valer-mono.png";

// Rodapé institucional. Hierarquia de marcas (Seção 6): Troféu protagonista,
// Hair Brasília um degrau acima, demais parceiros discretos.
// Escolas de Sucesso e Instituto Valer aparecem na linha "Uma realização" (logos),
// por isso saem da lista de parceiros — sem duplicar.
// Logos reais são placeholders por ora.
const PARCEIROS = [
  { nome: "Troféu Os Melhores do Ano – Beleza DF", destaque: "protagonista" },
  { nome: "Hair Brasília and Beauty", destaque: "apoio", href: "https://hairbrasilia.com.br/" },
] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-preto">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-14">
        {/* Realização — mesma linha de logos do topo (Escolas + Valer) */}
        <div className="flex flex-col items-center gap-3 border-b border-border/50 pb-10">
          <span className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-cinza-texto/60">
            Uma realização
          </span>
          <div className="flex items-center gap-8">
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src={logoEscolas}
                alt="Escolas de Sucesso"
                className="h-12 w-auto"
              />
            </Link>
            <Link href="/" className="hover:opacity-80 transition-opacity">
              <Image
                src={logoValer}
                alt="Instituto Valer"
                className="h-12 w-auto"
              />
            </Link>
          </div>
        </div>

        {/* Logos dos parceiros em linha (placeholders) */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {PARCEIROS.map((p) => {
            const content = p.nome;
            const className = p.destaque === "protagonista"
              ? "font-display text-sm font-bold uppercase tracking-wide text-dourado"
              : "font-sans text-sm font-semibold text-branco-quente hover:text-dourado transition-colors duration-300";
            
            if ('href' in p) {
              return (
                <a
                  key={p.nome}
                  href={p.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {content}
                </a>
              );
            }
            
            return (
              <span key={p.nome} className={className}>
                {content}
              </span>
            );
          })}
        </div>

        {/* Links Rápidos / Sitemap */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 border-t border-b border-border/30 py-6">
          <Link href="/" className="font-sans text-xs text-cinza-texto hover:text-dourado transition-colors">Home</Link>
          <Link href="#o-premio" className="font-sans text-xs text-cinza-texto hover:text-dourado transition-colors">O Prêmio</Link>
          <Link href="#como-funciona" className="font-sans text-xs text-cinza-texto hover:text-dourado transition-colors">Como Funciona</Link>
          <Link href="#categorias" className="font-sans text-xs text-cinza-texto hover:text-dourado transition-colors">Categorias</Link>
          <Link href="#premiacao" className="font-sans text-xs text-cinza-texto hover:text-dourado transition-colors">Premiação</Link>
          <Link href="/regulamento" className="font-sans text-xs text-cinza-texto hover:text-dourado transition-colors">Regulamento</Link>
          <Link href="/resultados" className="font-sans text-xs text-cinza-texto hover:text-dourado transition-colors">Resultados</Link>
        </div>


        <div className="flex flex-col items-center gap-2">
          <p className="text-center font-sans text-xs text-cinza-texto/70">
            © 2026 Troféu Os Melhores do Ano – Beleza DF. Todos os direitos
            reservados.
          </p>
          <p className="text-center font-sans text-[10px] text-cinza-texto/50 tracking-wider">
            Tecnologia e Inteligência Artificial por{" "}
            <a 
              href="https://neonai.com.br" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-dourado hover:underline transition-all"
            >
              Neon Aí
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
