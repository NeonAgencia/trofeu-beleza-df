import { Reveal } from "@/components/motion/reveal";

export function HeroTrophy() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[280px] sm:max-w-[400px] lg:max-w-[480px] mx-auto aspect-square">
      {/* Glow de fundo dourado (Aura do Troféu) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 scale-125 opacity-70"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,75,0.2) 0%, rgba(201,162,75,0) 70%)",
        }}
      />

      <Reveal className="flex flex-col items-center justify-center w-full h-full">
        {/* O Troféu em Vetor SVG com Gradiente de Ouro Metalizado e Textura */}
        <svg
          viewBox="0 0 24 24"
          className="w-[70%] h-[70%] drop-shadow-[0_0_32px_rgba(201,162,75,0.4)] animate-pulse-subtle"
          style={{ animationDuration: '4s' }}
        >
          <defs>
            <linearGradient id="goldMetal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFF2C2" />
              <stop offset="30%" stopColor="#F6E6AE" />
              <stop offset="50%" stopColor="#D5AF55" />
              <stop offset="75%" stopColor="#C9A24B" />
              <stop offset="100%" stopColor="#8A6721" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path
            fill="url(#goldMetal)"
            filter="url(#glow)"
            d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"
          />
        </svg>

        {/* Pedestal de Gala (Cilindro 3D Estilizado com Gradientes e Bordas de Ouro) */}
        <div className="relative w-[65%] h-8 mt-[-5%] sm:h-12 flex flex-col items-center">
          {/* Topo do Pedestal (Elipse Superior) */}
          <div className="absolute inset-x-0 top-0 h-4 sm:h-6 rounded-full bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 border border-dourado/40 shadow-[inset_0_1px_5px_rgba(255,255,255,0.15)] z-20" />
          
          {/* Corpo do Pedestal (Cilindro) */}
          <div className="absolute inset-x-0 top-2 sm:top-3 bottom-0 bg-gradient-to-r from-neutral-900 via-black to-neutral-900 border-x border-b border-dourado/30 rounded-b-xl z-10" />

          {/* Sombra projetada do pedestal */}
          <div
            aria-hidden
            className="absolute bottom-[-10px] w-[110%] h-4 -z-20 opacity-90 blur-sm"
            style={{
              background:
                "radial-gradient(ellipse, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0) 80%)",
            }}
          />
        </div>
      </Reveal>
    </div>
  );
}
