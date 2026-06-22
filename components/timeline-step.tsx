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
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="font-display text-5xl font-bold leading-none text-dourado">
        {number}
      </span>
      <h3 className="font-display text-lg font-semibold text-branco-quente">
        {title}
      </h3>
      <p className="font-sans text-sm leading-relaxed text-cinza-texto">
        {description}
      </p>
    </div>
  );
}
