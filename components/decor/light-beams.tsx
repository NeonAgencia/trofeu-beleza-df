import { cn } from "@/lib/utils";

// Feixes/arcos dourados de palco — o "holofote" das artes. CSS puro, leve no mobile.
// Decorativo: pointer-events-none + aria-hidden.
export function LightBeams({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Holofote — brilho radial descendo do topo */}
      <div
        className="absolute left-1/2 top-[-25%] h-[85%] w-[150%] -translate-x-1/2 motion-safe:animate-[spotlight-breathe_9s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(ellipse 50% 100% at 50% 0%, rgba(201,162,75,0.30), rgba(201,162,75,0) 70%)",
        }}
      />

      {/* Raios de spot radiando do ponto de luz */}
      <div
        className="absolute left-1/2 top-[-35%] h-[130%] w-[150%] -translate-x-1/2 opacity-50 motion-safe:animate-[spotlight-breathe_13s_ease-in-out_infinite] sm:opacity-70"
        style={{
          background:
            "repeating-conic-gradient(from 90deg at 50% 0%, transparent 0deg 5.4deg, rgba(232,201,122,0.10) 5.4deg 6deg)",
          maskImage:
            "radial-gradient(ellipse 55% 75% at 50% 0%, black, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 55% 75% at 50% 0%, black, transparent 78%)",
        }}
      />

      {/* Arcos dourados curvos (as linhas de luz das artes) */}
      <div className="absolute -right-1/4 top-[15%] hidden h-[130%] w-[80%] rounded-full border border-dourado/12 blur-[2px] sm:block" />
      <div className="absolute -left-1/3 top-[30%] h-[150%] w-[95%] rounded-full border border-dourado/[0.08] blur-[2px]" />
    </div>
  );
}
