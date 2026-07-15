import { SectionHeading } from "@/components/section-heading";
import { Reveal } from "@/components/motion/reveal";
import { TextureLines } from "@/components/decor/texture-lines";

const DESTAQUES = [
  {
    img: "/premio-icon-inscricao.png",
    alt: "Ícone Inscrição Online",
    title: "INSCRIÇÃO ONLINE",
    description: "Sua participação começa com um cadastro simples e digital.",
  },
  {
    img: "/premio-icon-votacao.png",
    alt: "Ícone Votação Popular",
    title: "VOTAÇÃO POPULAR",
    description: "A comunidade reconhece quem mais se destacou no ano.",
  },
  {
    img: "/premio-icon-regiao.png",
    alt: "Ícone Por Região Administrativa",
    title: "POR REGIÃO ADMINISTRATIVA",
    description: "Cada participante representa sua região e concorre com visibilidade local.",
  },
];

export function About() {
  return (
    <section
      id="o-premio"
      className="relative isolate overflow-hidden border-b border-border px-6 py-20 sm:py-24"
    >
      <TextureLines />
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <SectionHeading
          title="O Prêmio"
          subtitle="O que é o Troféu Os Melhores do Ano"
          align="left"
        />

        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Coluna Esquerda: Texto + Cards */}
          <div className="flex flex-col gap-8">
            <p className="font-sans text-base leading-relaxed text-cinza-texto">
              O Troféu Os Melhores do Ano – Beleza DF é uma premiação criada para
              reconhecer e valorizar profissionais, empresas e estabelecimentos
              que se destacam em todo o Distrito Federal. A proposta é dar
              visibilidade a quem trabalha todos os dias com talento, dedicação,
              atendimento, criatividade e compromisso com seus clientes.
            </p>

            <Reveal className="grid gap-4 sm:grid-cols-3">
              {DESTAQUES.map((d) => (
                <div
                  key={d.title}
                  className="flex flex-col items-center gap-3 rounded-xl border border-dourado/30 p-6 text-center
                    shadow-[0_4px_12px_rgba(201,162,75,0.03)]
                    transition-all duration-300
                    hover:border-dourado/60 hover:shadow-[0_4px_28px_rgba(201,162,75,0.14)]
                    hover:scale-[1.02]"
                >
                  <img
                    src={d.img}
                    alt={d.alt}
                    className="h-20 w-auto object-contain select-none pointer-events-none"
                  />
                  <h3 className="font-display text-sm font-bold uppercase tracking-widest text-dourado leading-snug">
                    {d.title}
                  </h3>
                  <p className="font-sans text-sm leading-relaxed text-cinza-texto">
                    {d.description}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Coluna Direita: Troféu */}
          <div className="w-full flex items-center justify-center">
            <div className="relative w-full max-w-[420px] aspect-[3/4] flex items-center justify-center">
              {/* Glow circular de fundo */}
              <div
                aria-hidden
                className="absolute inset-0 scale-95 opacity-50 blur-3xl"
                style={{
                  background:
                    "radial-gradient(circle, rgba(201,162,75,0.2) 0%, rgba(201,162,75,0) 70%)",
                }}
              />
              <img
                src="/trofeu-hero.jpg"
                alt="Troféu oficial Os Melhores do Ano"
                className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
