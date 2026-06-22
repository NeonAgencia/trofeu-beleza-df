import type { Metadata } from "next";
import { Cinzel, Montserrat } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/motion-provider";

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

const SITE_TITLE = "Troféu Os Melhores do Ano – Beleza DF";
const SITE_DESC =
  "Premiação popular que reconhece os melhores profissionais e estabelecimentos da beleza no Distrito Federal.";

export const metadata: Metadata = {
  // Em produção na Vercel resolve pro domínio .vercel.app; local cai no fallback.
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3000",
  ),
  title: SITE_TITLE,
  description: SITE_DESC,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: SITE_TITLE,
    title: SITE_TITLE,
    description: SITE_DESC,
    images: [
      { url: "/og.jpg", width: 1200, height: 630, alt: SITE_TITLE },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESC,
    images: ["/og.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${cinzel.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
