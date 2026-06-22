import { cn } from "@/lib/utils";

// Névoa/atmosfera do palco — blobs dourados/branco-quente MUITO sutis à deriva lenta
// sobre o preto, dando a sensação de uma fumaça única com a do vídeo do troféu.
// Camada de fundo (-z-10), mix-blend-screen (só soma luz). Leve: gradiente já difuso
// + blur pequeno. Sob reduced-motion o reset global congela o movimento.
const FOG = [
  { left: "12%", top: "42%", size: "52vw", c: "232,201,122", op: 0.05, dur: 28, delay: 0 },
  { left: "50%", top: "56%", size: "48vw", c: "245,240,230", op: 0.04, dur: 36, delay: -12 },
  { left: "66%", top: "30%", size: "44vw", c: "201,162,75", op: 0.05, dur: 31, delay: -20 },
] as const;

export function HeroFog({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden mix-blend-screen",
        className,
      )}
    >
      {FOG.map((f, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            background: `radial-gradient(circle, rgba(${f.c},${f.op}) 0%, rgba(${f.c},0) 66%)`,
            filter: "blur(26px)",
            animation: `fog-drift ${f.dur}s ease-in-out ${f.delay}s infinite`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
