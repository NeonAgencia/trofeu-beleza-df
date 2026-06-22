"use client";

import { motion, useReducedMotion } from "motion/react";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Atraso (s) pra escalonar reveals de blocos vizinhos. */
  delay?: number;
  /** Deslocamento vertical inicial (px). */
  y?: number;
};

// Reveal de cerimônia: o bloco "assenta" subindo de leve ao entrar na viewport — 1x.
// `initial` e a estrutura são constantes (idênticos no servidor e no 1º render do
// cliente) → sem hydration mismatch. A preferência de menos movimento só muda o
// comportamento DEPOIS da montagem: o conteúdo aparece de imediato, sem deslocar.
export function Reveal({ children, className, delay = 0, y = 16 }: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      {...(reduce
        ? { animate: { opacity: 1, y: 0 }, transition: { duration: 0 } }
        : {
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.2 },
            transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
          })}
    >
      {children}
    </motion.div>
  );
}
