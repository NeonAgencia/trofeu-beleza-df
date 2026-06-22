import Image from "next/image";
import logoEscolas from "@/public/logo-escolas-mono.png";
import logoValer from "@/public/logo-valer-mono.png";

// Rodapé institucional. Hierarquia de marcas (Seção 6): Troféu protagonista,
// Hair Brasília um degrau acima, demais parceiros discretos.
// Escolas de Sucesso e Instituto Valer aparecem na linha "Uma realização" (logos),
// por isso saem da lista de parceiros — sem duplicar.
// Logos reais são placeholders por ora.
const PARCEIROS = [
  { nome: "Troféu Os Melhores do Ano – Beleza DF", destaque: "protagonista" },
  { nome: "Hair Brasília and Beauty", destaque: "apoio" },
  { nome: "Cristiano Araújo", destaque: "parceiro" },
  { nome: "Brasília Capital da Beleza", destaque: "parceiro" },
  { nome: "ABB", destaque: "parceiro" },
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
            <Image
              src={logoEscolas}
              alt="Escolas de Sucesso"
              className="h-12 w-auto"
            />
            <Image
              src={logoValer}
              alt="Instituto Valer"
              className="h-12 w-auto"
            />
          </div>
        </div>

        {/* Logos dos parceiros em linha (placeholders) */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-4">
          {PARCEIROS.map((p) => (
            <span
              key={p.nome}
              className={
                p.destaque === "protagonista"
                  ? "font-display text-sm font-bold uppercase tracking-wide text-dourado"
                  : p.destaque === "apoio"
                    ? "font-sans text-sm font-semibold text-branco-quente"
                    : "font-sans text-xs text-cinza-texto"
              }
            >
              {/* [placeholder de logo] */}
              {p.nome}
            </span>
          ))}
        </div>

        {/* Contato */}
        <div className="flex flex-col items-center gap-1 text-center font-sans text-sm text-cinza-texto">
          <span>contato@trofeubelezadf.com.br</span>
          <span>WhatsApp: (61) 0000-0000</span>
          <span>Brasília, DF</span>
        </div>

        <p className="text-center font-sans text-xs text-cinza-texto/70">
          © 2026 Troféu Os Melhores do Ano – Beleza DF. Todos os direitos
          reservados.
        </p>
      </div>
    </footer>
  );
}
