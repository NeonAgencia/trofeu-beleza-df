import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ImagePlaceholderProps = {
  caption: string;
  className?: string;
};

// Placeholder de slot de imagem: retângulo com borda dourada tracejada + legenda.
// As fotos reais (WebP) entram numa fase futura.
export function ImagePlaceholder({ caption, className }: ImagePlaceholderProps) {
  return (
    <div
      className={cn(
        "flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-dourado/50 bg-grafite/40 p-6 text-center",
        className,
      )}
    >
      <ImageIcon className="size-8 text-dourado/70" aria-hidden />
      <span className="font-sans text-xs uppercase tracking-[0.2em] text-dourado/80">
        {caption}
      </span>
    </div>
  );
}
