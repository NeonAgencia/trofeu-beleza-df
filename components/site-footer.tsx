export function SiteFooter() {
  return (
    <footer className="bg-preto">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 pt-2 pb-14">
        {/* Realização e Apoio — Faixa unificada de logomarcas */}
        <div className="flex justify-center border-b border-border/20 pb-10">
          <img
            src="/footer-logos.png"
            alt="Realização e Apoio"
            className="h-40 sm:h-52 w-auto object-contain max-w-full select-none pointer-events-none opacity-95 hover:opacity-100 transition-opacity duration-300"
          />
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
