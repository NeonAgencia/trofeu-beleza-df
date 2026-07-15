import { cn } from "@/lib/utils";

type TimelineStepProps = {
  number: number;
  title: string;
  description: string;
  className?: string;
};

// Passo da timeline "Como funciona": número grande dourado + título + descrição.
export function TimelineStep({
  number,
  title,
  description,
  className,
}: TimelineStepProps) {
  return (
    <div className={cn("flex flex-col items-center gap-4 text-center", className)}>
      {/* Círculo dourado com borda */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dourado text-dourado shadow-[0_0_14px_rgba(201,162,75,0.3)]">
        <span className="font-display text-2xl font-bold leading-none">
          {number}
        </span>
      </div>
      <h3 className="font-display text-sm font-bold uppercase tracking-wider text-dourado leading-snug">
        {title}
      </h3>
      <p className="font-sans text-sm leading-relaxed text-cinza-texto">
        {description}
      </p>
    </div>
  );
}
