import { Trophy, BadgeCheck, ScrollText, Megaphone, Newspaper } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { FeatureCard } from "@/components/feature-card";
import { Reveal } from "@/components/motion/reveal";
import { TextureLines } from "@/components/decor/texture-lines";
import { CtaLink } from "@/components/cta-link";
import { LINK_INSCRICAO } from "@/lib/links";

const PREMIOS = [
  {
    icon: Trophy,
    title: "Troféu físico",
    description:
      "Entregue em noite de gala, em cerimônia exclusiva em Brasília.",
  },
  {
    icon: BadgeCheck,
    title: "Selo digital oficial",
    description:
      "Para finalistas e vencedores usarem nas suas comunicações.",
  },
  {
    icon: ScrollText,
    title: "Certificado físico",
    description: "Reconhecimento oficial, com moldura, para os vencedores.",
  },
  {
    icon: Megaphone,
    title: "Destaque no site e redes",
    description: "Projeção da marca e do trabalho do profissional.",
  },
  {
    icon: Newspaper,
    title: "Divulgação em veículos especializados",
    description: "Cobertura em mídias do setor de beleza.",
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

        {/* 2 cards em cima, 3 embaixo — ambas as linhas centralizadas e alinhadas entre si */}
        <Reveal className="flex flex-col gap-4">
          <div className="flex flex-wrap justify-center gap-4">
            {PREMIOS.slice(0, 2).map((p) => (
              <FeatureCard
                key={p.title}
                icon={p.icon}
                title={p.title}
                description={p.description}
                size="lg"
                className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2rem)/3)]"
              />
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            {PREMIOS.slice(2).map((p) => (
              <FeatureCard
                key={p.title}
                icon={p.icon}
                title={p.title}
                description={p.description}
                size="lg"
                className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-2rem)/3)]"
              />
            ))}
          </div>
        </Reveal>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
          <CtaLink href={LINK_INSCRICAO}>Se inscreva</CtaLink>
          <CtaLink href="/votar" variant="secondary">Vote no melhor</CtaLink>
        </div>
      </div>
    </section>
  );
}
