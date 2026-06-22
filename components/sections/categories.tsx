import {
  Scissors,
  PaintbrushVertical,
  Syringe,
  Flower2,
  Armchair,
  ScanFace,
} from "lucide-react";
import {
  Razor,
  NailPolish,
  Eyebrow,
  Lashes,
  BarberPole,
} from "@/components/icons/beauty-icons";
import { SectionHeading } from "@/components/section-heading";
import { CategoryCard } from "@/components/category-card";
import { Reveal } from "@/components/motion/reveal";
import { TextureLines } from "@/components/decor/texture-lines";

const PROFISSIONAIS = [
  { icon: Scissors, label: "Melhor Cabeleireiro(a)" },
  { icon: Razor, label: "Melhor Barbeiro" },
  { icon: PaintbrushVertical, label: "Melhor Maquiador(a)" },
  { icon: NailPolish, label: "Melhor Nail Design" },
  { icon: Eyebrow, label: "Melhor Designer de Sobrancelhas" },
  { icon: Lashes, label: "Melhor Lash Designer" },
  { icon: Syringe, label: "Melhor Micropigmentador(a)" },
  { icon: Flower2, label: "Melhor Profissional de Estética" },
];

const ESTABELECIMENTOS = [
  { icon: Armchair, label: "Melhor Salão de Beleza" },
  { icon: BarberPole, label: "Melhor Barbearia" },
  { icon: ScanFace, label: "Melhor Clínica de Estética" },
  { icon: NailPolish, label: "Melhor Esmalteria / Nail Studio" },
  { icon: Eyebrow, label: "Melhor Espaço de Design de Sobrancelhas" },
  { icon: Lashes, label: "Melhor Espaço de Lash Design / Extensão de Cílios" },
  { icon: Syringe, label: "Melhor Espaço de Micropigmentação" },
];

export function Categories() {
  return (
    <section
      id="categorias"
      className="relative isolate overflow-hidden border-b border-border px-6 py-20 sm:py-24"
    >
      <TextureLines />
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <SectionHeading
          title="Categorias"
          subtitle="Os profissionais e estabelecimentos que concorrem"
        />

        <div className="flex flex-col gap-6">
          <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-dourado">
            Profissionais
          </h3>
          <Reveal className="flex flex-wrap justify-center gap-4">
            {PROFISSIONAIS.map((c) => (
              <CategoryCard
                key={c.label}
                icon={c.icon}
                label={c.label}
                className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-3rem)/4)]"
              />
            ))}
          </Reveal>
        </div>

        <div className="flex flex-col gap-6">
          <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-dourado">
            Empresas e Estabelecimentos
          </h3>
          <Reveal className="flex flex-wrap justify-center gap-4">
            {ESTABELECIMENTOS.map((c) => (
              <CategoryCard
                key={c.label}
                icon={c.icon}
                label={c.label}
                className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc((100%-3rem)/4)]"
              />
            ))}
          </Reveal>
        </div>

        <p className="text-center font-display text-lg uppercase tracking-wide text-dourado-claro">
          Acompanhe. Participe. Viva esse reconhecimento.
        </p>
      </div>
    </section>
  );
}
