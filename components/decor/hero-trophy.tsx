import { Reveal } from "@/components/motion/reveal";

export function HeroTrophy() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[420px] lg:max-w-[480px] mx-auto aspect-[3/4]">
      {/* Glow de fundo dourado sutil */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 scale-110 opacity-50 blur-xl"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,75,0.15) 0%, rgba(201,162,75,0) 80%)",
        }}
      />

      <Reveal className="w-full h-full flex items-center justify-center">
        <img
          src="/trofeu-silhouette.jpg"
          alt="Troféu oficial Os Melhores do Ano"
          className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
        />
      </Reveal>
    </div>
  );
}
