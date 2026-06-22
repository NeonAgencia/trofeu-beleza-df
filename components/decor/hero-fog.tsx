import { cn } from "@/lib/utils";

// Névoa/atmosfera do palco — blobs dourados/branco-quente à deriva sobre o preto,
// dando a sensação de uma fumaça única com a do vídeo do troféu.
// Camada de fundo (-z-10), mix-blend-screen (só soma luz). Anima sempre; a opacidade
// do conjunto reforça ao rolar (--bg-energy).
const FOG = [
  { left: "12%", top: "42%", size: "52vw", c: "232,201,122", op: 0.12, dur: 18, delay: 0 },
  { left: "50%", top: "56%", size: "48vw", c: "245,240,230", op: 0.1, dur: 24, delay: -12 },
  { left: "66%", top: "30%", size: "44vw", c: "201,162,75", op: 0.13, dur: 20, delay: -20 },
] as const;

export function HeroFog({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      style={{ opacity: "calc(0.72 + var(--bg-energy) * 0.5)" }}
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden mix-blend-screen",
        className,
      )}
    >
      {FOG.map((f, i) => (
        <div
          key={i}
          className="fx absolute rounded-full"
          style={{
            left: f.left,
            top: f.top,
            width: f.size,
            height: f.size,
            background: `radial-gradient(circle, rgba(${f.c},${f.op}) 0%, rgba(${f.c},0) 66%)`,
            filter: "blur(26px)",
            animation: `fog-drift ${f.dur}s ease-in-out ${f.delay}s infinite`,
            willChange: "transform",
            ["--fxd" as string]: `${f.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
