import { Reveal } from "@/components/motion/reveal";

export function HeroTrophy() {
  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-[420px] lg:max-w-[480px] mx-auto aspect-[3/4]">
      {/* Glow de fundo dourado sutil */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 scale-110 opacity-60 blur-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(201,162,75,0.2) 0%, rgba(201,162,75,0) 70%)",
        }}
      />

      {/* Curvas de luz douradas de fundo em SVG vetorial */}
      <svg
        viewBox="0 0 400 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 w-full h-full -z-10 pointer-events-none"
      >
        <defs>
          <linearGradient id="goldCurve1" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A6721" stopOpacity="0" />
            <stop offset="30%" stopColor="#C9A24B" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#FFF2C2" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#C9A24B" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="goldCurve2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8A6721" stopOpacity="0" />
            <stop offset="40%" stopColor="#C9A24B" stopOpacity="0.3" />
            <stop offset="80%" stopColor="#FFF2C2" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#8A6721" stopOpacity="0" />
          </linearGradient>
          <filter id="blurGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Curva Principal Inferior */}
        <path
          d="M -50,450 C 150,420 300,280 450,50"
          stroke="url(#goldCurve1)"
          strokeWidth="3.5"
          filter="url(#blurGlow)"
        />
        
        {/* Curva Paralela Secundária */}
        <path
          d="M -20,480 C 180,440 330,300 480,80"
          stroke="url(#goldCurve2)"
          strokeWidth="2"
          filter="url(#blurGlow)"
          opacity="0.8"
        />

        {/* Partículas brilhantes flutuando (Círculos SVG desfocados) */}
        <circle cx="120" cy="380" r="3" fill="#FFF2C2" opacity="0.6" filter="url(#blurGlow)" />
        <circle cx="280" cy="220" r="2" fill="#FFF2C2" opacity="0.8" filter="url(#blurGlow)" />
        <circle cx="340" cy="150" r="4" fill="#E8C97A" opacity="0.5" filter="url(#blurGlow)" />
      </svg>

      <Reveal className="w-full h-full flex items-center justify-center">
        <img
          src="/trofeu-hero.jpg"
          alt="Troféu oficial Os Melhores do Ano"
          className="w-full h-full object-contain select-none pointer-events-none drop-shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
        />
      </Reveal>
    </div>
  );
}
