import {
  UserCheck,
  ClipboardCheck,
  MapPin,
  BarChart3,
  Lock,
  BookOpen,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { CtaLink } from "@/components/cta-link";
import { Reveal } from "@/components/motion/reveal";
import { TextureLines } from "@/components/decor/texture-lines";

const REGRAS = [
  {
    icon: UserCheck,
    text: "Voto único por usuário, com verificação por login seguro — cada voto conta e é registrado.",
  },
  {
    icon: ClipboardCheck,
    text: "Validação das inscrições pela organização antes da liberação para votação.",
  },
  {
    icon: MapPin,
    text: "Número mínimo por Região Administrativa — cada categoria abre conforme o regulamento.",
  },
  {
    icon: BarChart3,
    text: "Resultados oficiais — divulgados somente após a apuração, no calendário da organização.",
  },
  {
    icon: Lock,
    text: "LGPD — seus dados são protegidos; o cadastro e a votação seguem a política de privacidade.",
  },
];

export function Rules() {
  return (
    <section
      id="regulamento"
      className="relative isolate overflow-hidden border-b border-border px-6 py-20 sm:py-24"
    >
      <TextureLines />
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <SectionHeading
          title="Transparência"
          subtitle="Regras claras, voto que conta"
        />

        {/* Painel de vidro fosco escuro com borda dourada e glow */}
        <div className="glass-card flex flex-col gap-8 rounded-2xl border border-dourado/30 p-8 sm:p-10 shadow-[0_0_32px_rgba(201,162,75,0.06)]">
          <Reveal>
            <ul className="flex flex-col divide-y divide-dourado/15">
              {REGRAS.map((r) => {
                const Icon = r.icon;
                return (
                  <li key={r.text} className="flex items-center gap-6 py-5 first:pt-0 last:pb-0">
                    <div className="flex w-12 justify-center shrink-0">
                      <Icon
                        className="size-8 text-dourado drop-shadow-[0_0_12px_rgba(201,162,75,0.4)]"
                        aria-hidden
                      />
                    </div>
                    <div className="h-10 w-px bg-dourado/20 shrink-0" />
                    <span className="font-sans text-sm sm:text-base leading-relaxed text-cinza-texto pl-2">
                      {r.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <div className="flex justify-center pt-2">
            <CtaLink href="/regulamento" variant="secondary" className="flex items-center gap-2">
              <BookOpen className="size-4" />
              Ler o regulamento completo
            </CtaLink>
          </div>
        </div>
      </div>
    </section>
  );
}
