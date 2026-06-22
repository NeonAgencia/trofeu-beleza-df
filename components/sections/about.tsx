import Image from "next/image";
import { ClipboardList, Vote, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { FeatureCard } from "@/components/feature-card";
import { Reveal } from "@/components/motion/reveal";
import { TextureLines } from "@/components/decor/texture-lines";
import premioReconhecimento from "@/public/premio-reconhecimento.webp";

const DESTAQUES = [
  {
    icon: ClipboardList,
    title: "Inscrição Online",
    description: "Sua participação começa com um cadastro simples e digital.",
  },
  {
    icon: Vote,
    title: "Votação Popular",
    description: "A comunidade decide quem se destacou no ano.",
  },
  {
    icon: MapPin,
    title: "Por Região Administrativa",
    description: "Cada talento representa e concorre pela sua região.",
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
          <div className="flex flex-col gap-8">
            <p className="font-sans text-base leading-relaxed text-cinza-texto">
              O Troféu Os Melhores do Ano – Beleza DF é uma premiação criada para
              reconhecer e valorizar profissionais, empresas e estabelecimentos
              que movimentam o setor da beleza em todo o Distrito Federal. A
              proposta é dar visibilidade a quem trabalha todos os dias com
              talento, dedicação, atendimento, criatividade e compromisso com seus
              clientes.
            </p>

            <Reveal className="grid gap-4 sm:grid-cols-3">
              {DESTAQUES.map((d) => (
                <FeatureCard
                  key={d.title}
                  icon={d.icon}
                  title={d.title}
                  description={d.description}
                />
              ))}
            </Reveal>
          </div>

          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border">
            <Image
              src={premioReconhecimento}
              alt="Mulher emocionada recebendo o troféu dourado Os Melhores do Ano em cerimônia de gala, com plateia ao fundo"
              fill
              sizes="(max-width: 1024px) 90vw, 540px"
              placeholder="blur"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
