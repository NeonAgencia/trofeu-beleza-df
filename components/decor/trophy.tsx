// Troféu herói — silhueta em SVG com gradiente dourado (placeholder do troféu real/render).
export function Trophy({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 256 340"
      className={className}
      role="img"
      aria-label="Troféu Os Melhores do Ano"
      fill="none"
    >
      <defs>
        <linearGradient id="trofeu-ouro" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E6AE" />
          <stop offset="0.45" stopColor="#E8C97A" />
          <stop offset="1" stopColor="#A9842F" />
        </linearGradient>
      </defs>

      {/* Alças (atrás da taça) */}
      <path
        d="M72 72 C30 68 28 142 82 130"
        stroke="url(#trofeu-ouro)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      <path
        d="M184 72 C226 68 228 142 174 130"
        stroke="url(#trofeu-ouro)"
        strokeWidth="14"
        strokeLinecap="round"
      />

      <g fill="url(#trofeu-ouro)">
        {/* Borda da taça */}
        <rect x="58" y="52" width="140" height="20" rx="10" />
        {/* Taça */}
        <path d="M68 72 H188 C188 152 158 200 128 214 C98 200 68 152 68 72 Z" />
        {/* Haste */}
        <path d="M117 214 H139 L142 248 H114 Z" />
        {/* Base — dois degraus */}
        <path d="M97 248 H159 L167 268 H89 Z" />
        <rect x="79" y="268" width="98" height="22" rx="6" />
      </g>

      {/* Brilho sutil na taça */}
      <path
        d="M86 80 C84 128 98 168 120 188"
        stroke="#FFF7E0"
        strokeOpacity="0.35"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* Estrela gravada */}
      <path
        d="M128 104 l5.5 12 13 1 -10 9 3.5 13 -12 -7 -12 7 3.5 -13 -10 -9 13 -1 Z"
        fill="#0A0A0A"
        fillOpacity="0.22"
      />
    </svg>
  );
}
