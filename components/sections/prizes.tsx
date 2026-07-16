import { SectionHeading } from "@/components/section-heading";
import { FeatureCard } from "@/components/feature-card";
import { Reveal } from "@/components/motion/reveal";
import { TextureLines } from "@/components/decor/texture-lines";

const PREMIOS = [
  {
    img: "/prize-icon-trofeu.png",
    title: "TROFÉU FÍSICO",
    description:
      "Entregue em noite de gala, em cerimônia exclusiva em Brasília.",
  },
  {
    img: "/prize-icon-selo.png",
    title: "SELO DIGITAL OFICIAL",
    description:
      "Para finalistas e vencedores usarem nas suas comunicações.",
  },
  {
    img: "/prize-icon-certificado.png",
    title: "CERTIFICADO FÍSICO",
    description: "Reconhecimento oficial, com moldura, para os vencedores.",
  },
  {
    img: "/prize-icon-destaque.png",
    title: "DESTAQUE NO SITE E REDES",
    description: "Projeção da marca e do trabalho do profissional.",
  },
  {
    img: "/prize-icon-divulgacao.png",
    title: "DIVULGAÇÃO EM VEÍCULOS ESTRATÉGICOS",
    description: "Cobertura em mídias e ações do setor de beleza.",
  },
  {
    img: "/prize-icon-sistema.png",
    title: "SISTEMA NEON STYLE",
    description:
      "Uso gratuito do sistema de gestão por 30 dias para o vencedor de cada categoria.",
  },
];

export function Prizes() {
  return (
    <section
      id="premiacao"
      className="relative isolate overflow-hidden border-b border-border px-6 py-20 sm:py-24"
    >
      <TextureLines flip />
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <SectionHeading
          title="Premiação"
          subtitle="O que os vencedores recebem"
        />

        {/* Grade responsiva de 3 colunas para os 6 prêmios */}
        <Reveal>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PREMIOS.map((p) => (
              <FeatureCard
                key={p.title}
                img={p.img}
                title={p.title}
                description={p.description}
                size="lg"
                className="w-full"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
