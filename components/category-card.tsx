import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";
import { IgniteIcon } from "@/components/motion/ignite-icon";

type CategoryCardProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  label: string;
  className?: string;
};

// Card de categoria: ícone temático dourado grande + nome da categoria.
// Mesmo padrão visual dos cards da Premiação (ícone no topo, texto abaixo).
export function CategoryCard({ icon: Icon, label, className }: CategoryCardProps) {
  return (
    <div
      className={cn(
        "glass-card group flex flex-col items-center gap-4 rounded-xl p-6 text-center hover:scale-[1.02] motion-reduce:hover:scale-100",
        className,
      )}
    >
      <IgniteIcon>
        <Icon className="size-24 text-dourado transition-[filter] duration-300 group-hover:drop-shadow-[0_0_16px_rgba(201,162,75,0.75)]" aria-hidden />
      </IgniteIcon>
      <span className="font-sans text-base font-medium leading-snug text-branco-quente">
        {label}
      </span>
    </div>
  );
}
