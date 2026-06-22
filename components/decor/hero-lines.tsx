import { cn } from "@/lib/utils";

// Textura A — linhas de holofote: filetes dourados horizontais varrendo o palco.
// CSS puro (transform, composited → leve no mobile). Some sob prefers-reduced-motion.
// Cor fixa: token --dourado-claro (#E8C97A). Sutil, é coadjuvante do troféu.
const LINES = [
  { top: "17%", w: "55vw", dur: 14, delay: 0, op: 0.32, dir: "rtl" },
  { top: "34%", w: "70vw", dur: 20, delay: -7, op: 0.22, dir: "ltr" },
  { top: "51%", w: "44vw", dur: 17, delay: -3, op: 0.3, dir: "rtl" },
  { top: "68%", w: "60vw", dur: 23, delay: -11, op: 0.2, dir: "ltr" },
  { top: "85%", w: "50vw", dur: 16, delay: -9, op: 0.27, dir: "rtl" },
] as const;

export function HeroLines({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {LINES.map((l, i) => (
        <span
          key={i}
          className="absolute left-0 block h-px motion-reduce:hidden"
          style={{
            top: l.top,
            width: l.w,
            opacity: l.op,
            background:
              "linear-gradient(90deg, transparent, var(--dourado-claro), transparent)",
            animation: `hero-line-${l.dir} ${l.dur}s linear ${l.delay}s infinite`,
            willChange: "transform",
          }}
        />
      ))}
    </div>
  );
}
