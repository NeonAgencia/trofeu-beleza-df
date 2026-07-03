import Image from "next/image";
import {
  CheckCircle2,
  ShieldCheck,
  Users,
  CalendarCheck,
  Lock,
} from "lucide-react";
import { SectionHeading } from "@/components/section-heading";
import { CtaLink } from "@/components/cta-link";
import { Reveal } from "@/components/motion/reveal";
import { TextureLines } from "@/components/decor/texture-lines";
import heroBeleza from "@/public/hero-beleza.webp";

const REGRAS = [
  {
    icon: CheckCircle2,
    text: "Voto único por usuário, com verificação por login seguro — cada voto conta e é registrado.",
  },
  {
    icon: ShieldCheck,
    text: "Validação das inscrições pela organização antes da liberação para votação.",
  },
  {
    icon: Users,
    text: "Número mínimo por Região Administrativa — cada categoria abre conforme o regulamento.",
  },
  {
    icon: CalendarCheck,
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

        {/* Painel de vidro fosco escuro — mesmo glass dos cards, envolvendo as regras */}
        <div className="glass-card flex flex-col gap-8 rounded-2xl p-8 sm:p-10">
          <Reveal>
            <ul className="flex flex-col gap-5">
              {REGRAS.map((r) => {
                const Icon = r.icon;
                return (
                  <li key={r.text} className="flex items-start gap-3">
                    <Icon
                      className="mt-0.5 size-5 shrink-0 text-dourado"
                      aria-hidden
                    />
                    <span className="font-sans text-sm leading-relaxed text-cinza-texto">
                      {r.text}
                    </span>
                  </li>
                );
              })}
            </ul>
          </Reveal>

          <div>
            <CtaLink href="/regulamento" variant="secondary">
              Ler o regulamento completo
            </CtaLink>
          </div>
        </div>
      </div>

      {/* Imagem de respiro — a beleza real, fechando a seção de transparência */}
      <Reveal className="relative mx-auto mt-16 aspect-[16/9] max-w-6xl overflow-hidden rounded-2xl border border-border sm:aspect-[21/9]">
        <Image
          src={heroBeleza}
          alt="Cabeleireira premium finalizando um penteado elaborado numa cliente, em ambiente sofisticado à luz de velas"
          fill
          sizes="(max-width: 1024px) 92vw, 1100px"
          placeholder="blur"
          className="object-cover object-center"
        />
      </Reveal>
    </section>
  );
}
