"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  title: string; // rótulo curto da seção — protagonista, dourado e grande
  subtitle: string; // frase descritiva — secundária, off-white e menor
  align?: "center" | "left";
  className?: string;
};

// Cabeçalho de seção: título display (Cinzel) dourado em destaque + subtítulo off-white.
// Fase 5 — o holofote acende: ao entrar na viewport o título sobe de leve e ganha
// um halo dourado que acende e assenta (1x).
// `initial` e estrutura constantes (sem ramificar o 1º render) → sem hydration
// mismatch. Reduced-motion só troca o gatilho depois da montagem: aparece de
// imediato, sem deslocamento nem glow.
export function SectionHeading({
  title,
  subtitle,
  align = "center",
  className,
}: SectionHeadingProps) {
  const reduce = useReducedMotion();

  const trigger = reduce
    ? { animate: "show" as const }
    : {
        whileInView: "show" as const,
        viewport: { once: true, amount: 0.3 },
      };

  return (
    <motion.div
      className={cn(
        "flex flex-col gap-3",
        align === "center"
          ? "items-center text-center"
          : "items-start text-left",
        className,
      )}
      initial="hidden"
      {...trigger}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.1 } },
      }}
    >
      <motion.h2
        className="bg-gradient-to-b from-[#F6E6AE] via-dourado-claro to-[#A9842F] bg-clip-text pt-[0.12em] font-display text-4xl font-bold uppercase leading-[1.18] tracking-wide text-transparent sm:text-5xl lg:text-6xl"
        variants={{
          hidden: { opacity: 0, y: 12 },
          show: {
            opacity: 1,
            y: 0,
            filter: reduce
              ? "drop-shadow(0 0 0 transparent)"
              : [
                  "drop-shadow(0 0 16px rgba(232,201,122,0))",
                  "drop-shadow(0 0 22px rgba(232,201,122,0.5))",
                  "drop-shadow(0 0 8px rgba(232,201,122,0.14))",
                ],
          },
        }}
        transition={{
          duration: reduce ? 0 : 0.7,
          ease: "easeOut",
          filter: reduce ? { duration: 0 } : { duration: 1.2, times: [0, 0.45, 1] },
        }}
      >
        {title}
      </motion.h2>
      <motion.div
        className={cn(
          "flex flex-col gap-2.5",
          align === "center" ? "items-center" : "items-start",
        )}
        variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}
        transition={{ duration: reduce ? 0 : 0.5, ease: "easeOut" }}
      >
        <p
          className={cn(
            "font-sans text-lg font-semibold leading-relaxed text-branco-quente sm:text-xl",
            align === "center" && "max-w-2xl text-center",
          )}
        >
          {subtitle}
        </p>
        {/* Divisória dourada fina — separa e destaca o subtítulo, sem competir. */}
        <span
          aria-hidden
          className={cn(
            "h-px w-20",
            align === "center"
              ? "bg-gradient-to-r from-transparent via-dourado to-transparent"
              : "bg-gradient-to-r from-dourado to-transparent",
          )}
        />
      </motion.div>
    </motion.div>
  );
}
