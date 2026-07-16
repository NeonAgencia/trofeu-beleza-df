import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";
import { IgniteIcon } from "@/components/motion/ignite-icon";
import { CtaLink } from "@/components/cta-link";

type FeatureCardProps = {
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  img?: string;
  title: string;
  description: string;
  className?: string;
  /** "lg" dá mais destaque ao ícone e ao texto (usado na Premiação). */
  size?: "md" | "lg";
  ctaText?: string;
  ctaHref?: string;
};

// Card de destaque: ícone dourado + título + 1 linha.
// Usado no Bloco "O que é o prêmio" (md) e na Premiação (lg).
export function FeatureCard({
  icon: Icon,
  img,
  title,
  description,
  className,
  size = "md",
  ctaText,
  ctaHref,
}: FeatureCardProps) {
  const lg = size === "lg";

  return (
    <div
      className={cn(
        "glass-card group flex flex-col rounded-xl p-6 hover:scale-[1.02] motion-reduce:hover:scale-100",
        lg ? "items-center gap-4 text-center" : "gap-3",
        className,
      )}
    >
      {img ? (
        <img
          src={img}
          alt={title}
          className={cn(
            "object-contain select-none pointer-events-none transition-[filter] duration-300 group-hover:drop-shadow-[0_0_16px_rgba(201,162,75,0.75)]",
            lg ? "size-24" : "size-7",
          )}
        />
      ) : Icon ? (
        <IgniteIcon>
          <Icon
            className={cn(
              "text-dourado transition-[filter] duration-300 group-hover:drop-shadow-[0_0_16px_rgba(201,162,75,0.75)]",
              lg ? "size-24" : "size-7",
            )}
            aria-hidden
          />
        </IgniteIcon>
      ) : null}
      <h3
        className={cn(
          "font-display font-semibold text-branco-quente",
          lg ? "text-xl" : "text-lg",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "font-sans leading-relaxed text-cinza-texto",
          lg ? "text-base" : "text-sm",
        )}
      >
        {description}
      </p>
      {ctaText && ctaHref && (
        <div className="mt-auto pt-2">
          <CtaLink
            href={ctaHref}
            className="w-full h-10 px-4 text-xs font-bold"
            variant={title.toLowerCase().includes("votação") || title.toLowerCase().includes("voto") ? "secondary" : "primary"}
          >
            {ctaText}
          </CtaLink>
        </div>
      )}
    </div>
  );
}
