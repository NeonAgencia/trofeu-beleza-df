import type { SVGProps } from "react";

// Ícones de linha no estilo lucide (viewBox 24, stroke currentColor, traço 2, cantos
// arredondados) para categorias de beleza que o lucide não cobre. Herdam cor/tamanho
// via className (text-dourado + size-*), igual aos ícones lucide.
type IconProps = SVGProps<SVGSVGElement>;

const base = {
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

// Navalha de barbeiro (lâmina + cabo)
export function Razor(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 16 L13.5 6.5 a1.6 1.6 0 0 1 2.3 2.3 L6.3 18.3 a1.6 1.6 0 0 1 -2.3 -2.3 Z" />
      <path d="M15.3 8.2 L20.5 5.5" />
      <path d="M12 10.5 L9.5 13" />
    </svg>
  );
}

// Frasco de esmalte (tampa + frasco)
export function NailPolish(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="9.5" y="2.5" width="5" height="4.5" rx="1" />
      <path d="M10.5 7 H13.5" />
      <path d="M8.5 21.5 v-8.5 a3.5 3.5 0 0 1 3.5 -3.5 a3.5 3.5 0 0 1 3.5 3.5 v8.5 a0.6 0.6 0 0 1 -0.6 0.6 h-5.8 a0.6 0.6 0 0 1 -0.6 -0.6 Z" />
    </svg>
  );
}

// Sobrancelha (arco que afina na cauda)
export function Eyebrow(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 14 C 7 8.5, 16 8.5, 21 11.5" />
      <path d="M4.5 14.8 C 8 11.5, 13 11.6, 17.5 12.8" />
    </svg>
  );
}

// Cílios (pálpebra + fios)
export function Lashes(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 14.5 C 7 19, 17 19, 21.5 14.5" />
      <path d="M4.5 13.3 L3.4 10.3" />
      <path d="M8.3 16.4 L7.6 13.1" />
      <path d="M12 17.2 L12 13.7" />
      <path d="M15.7 16.4 L16.4 13.1" />
      <path d="M19.5 13.3 L20.6 10.3" />
    </svg>
  );
}

// Poste de barbearia (cilindro + faixas + caps)
export function BarberPole(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="8.5" y="5" width="7" height="14" rx="3.5" />
      <path d="M9 3.5 H15" />
      <path d="M9 20.5 H15" />
      <path d="M8.7 11 L15.3 8.4" />
      <path d="M8.7 14.6 L15.3 12" />
      <path d="M8.7 18.2 L15.3 15.6" />
    </svg>
  );
}
