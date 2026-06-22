"use client";

import { motion, useReducedMotion } from "motion/react";

// Holofote no ícone: ao entrar na viewport o ícone acende um glow dourado que
// assenta — 1x. Recebe o ícone já renderizado como children (Server Component não
// pode passar um componente/função para um Client Component, mas pode passar o
// elemento). Estrutura constante → sem hydration mismatch; reduced-motion fica
// neutro (sem brilho).
export function IgniteIcon({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      className="inline-flex shrink-0"
      initial={{ filter: "drop-shadow(0 0 0px rgba(201,162,75,0))" }}
      {...(reduce
        ? {}
        : {
            whileInView: {
              filter: [
                "drop-shadow(0 0 0px rgba(201,162,75,0))",
                "drop-shadow(0 0 9px rgba(201,162,75,0.7))",
                "drop-shadow(0 0 2px rgba(201,162,75,0.25))",
              ],
            },
            viewport: { once: true, amount: 0.8 },
            transition: {
              duration: 1.1,
              times: [0, 0.45, 1],
              ease: "easeOut",
              delay: 0.15,
            },
          })}
    >
      {children}
    </motion.span>
  );
}
