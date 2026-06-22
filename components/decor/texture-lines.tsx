import { cn } from "@/lib/utils";

// Textura B — filetes dourados que se desenham (traço de luz revelando o palco).
// SVG de fundo (absolute, -z-10) atrás do conteúdo. A animação é CSS pura
// (.td-line + keyframe line-draw em globals.css), sem JS → sem risco de hidratação.
// `flip` espelha a composição na horizontal pra variar entre seções vizinhas.

// Mistura de segmentos com quina (circuito) e curvas suaves (luz), saindo das bordas.
const LINES = [
  "M -40 160 H 360 L 470 270 H 900 L 1010 160 H 1260",
  "M -40 640 H 300 L 410 520 H 760",
  "M 1260 700 H 980 L 870 560 H 560",
  "M 600 -40 V 200 L 720 320",
  "M -40 430 C 220 380 400 470 620 410 S 1010 360 1260 430",
];

export function TextureLines({
  className,
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        fill="none"
        style={flip ? { transform: "scaleX(-1)" } : undefined}
      >
        {LINES.map((d, i) => (
          <path
            key={d}
            d={d}
            pathLength={1}
            className="td-line"
            style={{
              animationDuration: `${8 + i * 0.9}s`,
              animationDelay: `${i * 0.7}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
