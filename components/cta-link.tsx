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
        "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-sans font-semibold tracking-wide transition-[color,background-color,box-shadow] duration-300",
        size === "lg" ? "h-13 px-8 text-base" : "h-11 px-6 text-sm",
        variant === "primary" &&
          "bg-dourado text-preto hover:bg-dourado-claro hover:shadow-[0_0_24px_-6px_rgba(201,162,75,0.65)]",
        variant === "secondary" &&
          "border border-dourado text-dourado hover:bg-dourado hover:text-preto hover:shadow-[0_0_22px_-8px_rgba(201,162,75,0.55)]",
        className,
      )}
    >
      {children}
    </Link>
  );
}
