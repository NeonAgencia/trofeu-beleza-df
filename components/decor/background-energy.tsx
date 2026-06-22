"use client";

import { useEffect } from "react";

// Reforça os efeitos de fundo ao rolar: a cada scroll, sobe a variável CSS
// --bg-energy (0→1), que decai sozinha quando o scroll para. Os efeitos (linhas,
// névoa, holofotes) leem essa variável pra ficar mais fortes durante a rolagem.
// Leve: o loop de decaimento só roda enquanto há energia; depois para.
export function BackgroundEnergy() {
  useEffect(() => {
    const root = document.documentElement;
    let energy = 0;
    let raf = 0;
    let last = window.scrollY;

    const tick = () => {
      energy *= 0.9;
      if (energy > 0.005) {
        root.style.setProperty("--bg-energy", energy.toFixed(3));
        raf = requestAnimationFrame(tick);
      } else {
        root.style.setProperty("--bg-energy", "0");
        raf = 0;
      }
    };

    const onScroll = () => {
      const dy = Math.abs(window.scrollY - last);
      last = window.scrollY;
      energy = Math.min(1, energy + dy / 220);
      root.style.setProperty("--bg-energy", energy.toFixed(3));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return null;
}
