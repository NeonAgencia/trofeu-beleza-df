"use client";

import { MotionConfig } from "motion/react";

// Respeita prefers-reduced-motion globalmente: quem pediu menos movimento não
// recebe deslocamentos/escala — o motion só ajusta a animação, sem trocar a
// estrutura renderizada (evita hydration mismatch).
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
