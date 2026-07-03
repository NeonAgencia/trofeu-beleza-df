import { SectionHeading } from "@/components/section-heading";
import { TimelineStep } from "@/components/timeline-step";
import { Reveal } from "@/components/motion/reveal";
import { TextureLines } from "@/components/decor/texture-lines";
import { CtaLink } from "@/components/cta-link";
import { LINK_INSCRICAO } from "@/lib/links";

const PASSOS = [
  {
    number: 1,
    title: "Faça sua inscrição online",
    description: "Preencha o cadastro com seus dados e sua categoria.",
  },
  {
    number: 2,
    title: "Escolha sua categoria",
    description:
      "Selecione a área em que você atua e a sua Região Administrativa.",
  },
  {
    number: 3,
    title: "Participe da votação popular",
    description: "Quando a votação abrir, a comunidade vota nos melhores.",
  },
  {
    number: 4,
    title: "Aguarde o reconhecimento",
    description:
      "Os vencedores são revelados após a apuração oficial.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative isolate overflow-hidden border-b border-border px-6 py-20 sm:py-24"
    >
      <TextureLines flip />
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <SectionHeading
          title="Como Funciona"
          subtitle="Simples, digital e por Região Administrativa"
        />

        {/* Painel de vidro fosco escuro — mesmo glass dos cards, envolvendo a timeline */}
        <div className="glass-card flex flex-col gap-10 rounded-2xl p-8 sm:p-10">
          <Reveal>
            <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {PASSOS.map((p) => (
                <li key={p.number}>
                  <TimelineStep
                    number={p.number}
                    title={p.title}
                    description={p.description}
                  />
                </li>
              ))}
            </ol>
          </Reveal>

          <p className="mx-auto max-w-3xl text-center font-sans text-sm leading-relaxed text-cinza-texto">
            Após a inscrição, a organização valida os dados. As categorias que
            atingirem o número mínimo de inscritos por Região Administrativa
            entram em votação.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <CtaLink href={LINK_INSCRICAO}>Se inscreva</CtaLink>
            <CtaLink href="/votar" variant="secondary">Vote no melhor</CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
