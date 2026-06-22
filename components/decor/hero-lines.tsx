import { cn } from "@/lib/utils";

// Textura A — linhas de holofote: filetes dourados horizontais varrendo o palco.
// CSS puro (transform, composited → leve no mobile). Anima sempre; o conjunto
// reforça ao rolar (--bg-energy). Cor fixa: token --dourado-claro (#E8C97A).
const LINES = [
  { top: "17%", w: "55vw", dur: 10, delay: 0, op: 0.46, dir: "rtl" },
  { top: "34%", w: "70vw", dur: 14, delay: -7, op: 0.34, dir: "ltr" },
  { top: "51%", w: "44vw", dur: 12, delay: -3, op: 0.44, dir: "rtl" },
  { top: "68%", w: "60vw", dur: 16, delay: -11, op: 0.32, dir: "ltr" },
  { top: "85%", w: "50vw", dur: 11, delay: -9, op: 0.4, dir: "rtl" },
] as const;

export function HeroLines({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      style={{ opacity: "calc(0.8 + var(--bg-energy) * 0.4)" }}
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {LINES.map((l, i) => (
        <span
          key={i}
          className="fx absolute left-0 block h-px"
          style={{
            top: l.top,
            width: l.w,
            opacity: l.op,
            background:
              "linear-gradient(90deg, transparent, var(--dourado-claro), transparent)",
            animation: `hero-line-${l.dir} ${l.dur}s linear ${l.delay}s infinite`,
            willChange: "transform",
            ["--fxd" as string]: `${l.dur}s`,
          }}
        />
      ))}
    </div>
  );
}
