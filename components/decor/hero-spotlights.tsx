import { cn } from "@/lib/utils";

// Holofotes de palco: cones de luz dourada saindo do topo, POR CIMA do vídeo e do
// hero, iluminando o troféu e costurando a transição com o fundo. mix-blend-screen
// (só adiciona luz, não esconde nada), bem sutis. Leve oscilação (motion-safe);
// sob reduced-motion ficam estáticos mas visíveis (luz ambiente, não movimento).
const SPOTS = [
  { left: "50%", w: "24vw", rot: 13, c: "232,201,122", op: 0.18, blur: 30, dur: 9, delay: 0 },
  { left: "72%", w: "20vw", rot: -11, c: "201,162,75", op: 0.14, blur: 34, dur: 11, delay: -5 },
  { left: "28%", w: "18vw", rot: 19, c: "232,201,122", op: 0.12, blur: 38, dur: 13, delay: -9 },
] as const;

export function HeroSpotlights({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      style={{ opacity: "calc(0.78 + var(--bg-energy) * 0.45)" }}
      className={cn(
        "pointer-events-none absolute inset-0 z-20 overflow-hidden mix-blend-screen",
        className,
      )}
    >
      {SPOTS.map((s, i) => (
        <div
          key={i}
          className="fx absolute top-[-22%] h-[150%] origin-top"
          style={{
            left: s.left,
            width: s.w,
            background: `linear-gradient(180deg, rgba(${s.c},${s.op}) 0%, rgba(${s.c},0) 72%)`,
            filter: `blur(${s.blur}px)`,
            clipPath: "polygon(42% 0%, 58% 0%, 100% 100%, 0% 100%)",
            transform: "rotate(var(--rot))",
            // animação inline (o arbitrary do Tailwind não resolve var() na animation)
            animation: `spotlight-sway ${s.dur}s ease-in-out ${s.delay}s infinite`,
            ["--rot" as string]: `${s.rot}deg`,
            ["--fxd" as string]: `${s.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
