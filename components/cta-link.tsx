import Link from "next/link";
import { cn } from "@/lib/utils";

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "default" | "lg";
  className?: string;
};

// Botão de ação do prêmio. variant primary = dourado sólido; secondary = outline dourado.
// Renderiza como link (os CTAs apontam pra âncoras/placeholder de inscrição).
export function CtaLink({
  href,
  children,
  variant = "primary",
  size = "default",
  className,
}: CtaLinkProps) {
  // Links externos (http) abrem em nova aba, com segurança.
  const isExternal = href.startsWith("http");
  return (
    <Link
      href={href}
      {...(isExternal
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-sans font-semibold tracking-wide transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shimmer-border",
        size === "lg" ? "h-13 px-8 text-base" : "h-11 px-6 text-sm",
        variant === "primary" &&
          "bg-dourado text-preto hover:bg-dourado-claro hover:shadow-[0_0_30px_0_rgba(201,162,75,0.7)]",
        variant === "secondary" &&
          "border border-dourado text-dourado hover:bg-dourado hover:text-preto hover:shadow-[0_0_25px_0_rgba(201,162,75,0.5)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
