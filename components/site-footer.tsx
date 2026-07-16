import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-preto">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-14">
        {/* Realização e Apoio — Faixa unificada de logomarcas */}
        <div className="flex justify-center border-b border-border/30 pb-10">
          <img
            src="/footer-logos.png"
            alt="Realização e Apoio"
            className="h-16 sm:h-20 w-auto object-contain max-w-full select-none pointer-events-none opacity-90 hover:opacity-100 transition-opacity duration-300"
          />
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
