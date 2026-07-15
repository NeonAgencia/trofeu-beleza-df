import { SectionHeading } from "@/components/section-heading";
import { TimelineStep } from "@/components/timeline-step";
import { Reveal } from "@/components/motion/reveal";
import { TextureLines } from "@/components/decor/texture-lines";
import { CtaLink } from "@/components/cta-link";
import { LINK_INSCRICAO } from "@/lib/links";

const PASSOS = [
  {
    number: 1,
    title: "FAÇA SUA INSCRIÇÃO ONLINE",
    description: "Preencha o cadastro com seus dados e sua categoria.",
  },
  {
    number: 2,
    title: "ESCOLHA SUA CATEGORIA",
    description:
      "Selecione a área em que você atua e a sua Região Administrativa.",
  },
  {
    number: 3,
    title: "PARTICIPE DA VOTAÇÃO POPULAR",
    description: "Quando a votação abrir, a comunidade vota nos melhores.",
  },
  {
    number: 4,
    title: "ACOMPANHE O RESULTADO",
    description:
      "Os vencedores são reconhecidos após a apuração oficial.",
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

        {/* Painel com borda dourada envolvendo os 4 passos */}
        <div className="rounded-2xl border border-dourado/40 p-8 sm:p-10 shadow-[0_0_32px_rgba(201,162,75,0.06)]">
          <Reveal>
            <ol className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-dourado/25">
              {PASSOS.map((p) => (
                <li key={p.number} className="lg:px-6 first:lg:pl-0 last:lg:pr-0">
                  <TimelineStep
                    number={p.number}
                    title={p.title}
                    description={p.description}
                  />
                </li>
              ))}
            </ol>
          </Reveal>

          <p className="mx-auto mt-10 max-w-3xl text-center font-sans text-sm leading-relaxed text-cinza-texto">
            Após a inscrição, a organização valida os dados. As categorias que
            atingirem o número mínimo de inscritos por Região Administrativa
            entram em votação.
          </p>
        </div>
      </div>
    </section>
  );
}
