import { SectionHeading } from "@/components/section-heading";
import { CategoryCard } from "@/components/category-card";
import { Reveal } from "@/components/motion/reveal";
import { TextureLines } from "@/components/decor/texture-lines";

const PROFISSIONAIS = [
  { img: "/cat-icon-cabeleireiro.png", label: "Melhor Cabeleireiro(a)" },
  { img: "/cat-icon-barbeiro.png", label: "Melhor Barbeiro" },
  { img: "/cat-icon-manicure.png", label: "Melhor Manicure" },
  { img: "/cat-icon-estetica.png", label: "Melhor Profissional de Estética" },
  { img: "/cat-icon-sobrancelhas.png", label: "Melhor Designer de Sobrancelhas" },
  { img: "/cat-icon-lash.png", label: "Melhor Lash Designer" },
  { img: "/cat-icon-micropigmentador.png", label: "Melhor Micropigmentador(a)" },
  { img: "/cat-icon-maquiador.png", label: "Melhor Maquiador(a)" },
];

const ESTABELECIMENTOS = [
  { img: "/estab-icon-salao.png", label: "Melhor Salão de Beleza" },
  { img: "/estab-icon-barbearia.png", label: "Melhor Barbearia" },
  { img: "/estab-icon-estetica.png", label: "Melhor Clínica de Estética" },
  { img: "/estab-icon-nail.png", label: "Melhor Nail Studio" },
  { img: "/estab-icon-sobrancelhas.png", label: "Melhor Espaço de Design de Sobrancelhas" },
  { img: "/estab-icon-lash.png", label: "Melhor Espaço de Lash Design / Extensão de Cílios" },
  { img: "/estab-icon-micropigmentacao.png", label: "Melhor Espaço de Micropigmentação" },
];

export function Categories() {
  return (
    <>
      {/* SEÇÃO A: PROFISSIONAIS */}
      <section
        id="categorias"
        className="relative isolate overflow-hidden border-b border-border px-6 py-20 sm:py-24"
      >
        <TextureLines />
        <div className="mx-auto flex max-w-6xl flex-col gap-12">
          <SectionHeading
            title="Categorias"
            subtitle="Profissionais que concorrem"
          />

          <Reveal className="flex flex-wrap justify-center gap-4">
            {PROFISSIONAIS.map((c) => (
              <CategoryCard
                key={c.label}
                img={c.img}
                label={c.label}
                className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-3rem)/4)]"
              />
            ))}
          </Reveal>
        </div>
      </section>

      {/* SEÇÃO B: EMPRESAS E ESTABELECIMENTOS */}
      <section
        id="estabelecimentos"
        className="relative isolate overflow-hidden border-b border-border px-6 py-20 sm:py-24"
      >
        <TextureLines flip />
        <div className="mx-auto flex max-w-6xl flex-col gap-12">
          <SectionHeading
            title="Categorias"
            subtitle="Empresas e estabelecimentos que concorrem"
          />

          <Reveal className="flex flex-wrap justify-center gap-4">
            {ESTABELECIMENTOS.map((c) => (
              <CategoryCard
                key={c.label}
                img={c.img}
                label={c.label}
                className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-3rem)/4)]"
              />
            ))}
          </Reveal>

          <div className="flex flex-col items-center gap-6 mt-6">
            <p className="text-center font-display text-lg uppercase tracking-wider text-dourado-claro">
              ACOMPANHE, PARTICIPE, VIVA ESSE RECONHECIMENTO
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
