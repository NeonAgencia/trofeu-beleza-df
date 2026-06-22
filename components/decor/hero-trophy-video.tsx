"use client";

import { useEffect, useRef } from "react";

// Vídeo do troféu girando, ao NATURAL — preenche o vão da moldura (object-cover).
// LOOP nativo contínuo: o vídeo foi montado com 1º frame = último, então `loop` +
// preload="auto" (todo bufferizado) emenda sem tranco nem recarregar. autoplay/muted/
// playsInline (iOS). IntersectionObserver (rootMargin generoso) religa o play ao
// (quase) entrar na viewport.
// O vídeo é conteúdo do hero (giro lento, mudo): toca SEMPRE, independente de
// reduced-motion (que no iOS pausaria autoplay). Os enfeites animados ao redor
// (feixe, linhas, névoa) é que respeitam reduced-motion.
export function HeroTrophyVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    void v.play?.().catch(() => {});

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void v.play?.().catch(() => {});
        else v.pause();
      },
      { threshold: 0, rootMargin: "600px 0px 600px 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <video
        ref={ref}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/trofeu-hero-poster.webp"
        aria-label="Troféu oficial Os Melhores do Ano da Beleza DF, escultura dourada de cabeça feminina com chama, girando lentamente"
        className="absolute inset-0 block h-full w-full object-cover"
      >
        <source src="/trofeu-hero.mp4" type="video/mp4" />
      </video>

      {/* Feixe de luz dourado varrendo o troféu (de tempos em tempos) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-screen"
      >
        <div
          className="fx absolute inset-y-0 -left-1/3 w-1/3 animate-[trophy-sweep_8s_ease-in-out_infinite]"
          style={{
            background:
              "linear-gradient(100deg, rgba(232,201,122,0) 0%, rgba(232,201,122,0.45) 50%, rgba(232,201,122,0) 100%)",
            filter: "blur(7px)",
            ["--fxd" as string]: "8s",
          }}
        />
      </div>

      {/* Glow dourado de "spot de palco" — segue o troféu */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          background:
            "radial-gradient(42% 40% at 50% 43%, rgba(201,162,75,0.30), rgba(201,162,75,0) 72%)",
        }}
      />

      {/* Apaga o feixe interno nas bordas + cobre a marca d'água "Dola AI" */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, #000 0%, rgba(0,0,0,0) 16%, rgba(0,0,0,0) 84%, #000 100%), linear-gradient(0deg, #000 0%, rgba(0,0,0,0) 9%, rgba(0,0,0,0) 93%, #000 100%), radial-gradient(ellipse 44% 28% at 98% 96%, #000 0%, #000 55%, rgba(0,0,0,0) 82%)",
        }}
      />
    </div>
  );
}
