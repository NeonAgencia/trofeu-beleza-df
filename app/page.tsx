import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Categories } from "@/components/sections/categories";
import { Prizes } from "@/components/sections/prizes";
import { Rules } from "@/components/sections/rules";
import { FinalCta } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <About />
        <HowItWorks />
        <Categories />
        <Prizes />
        <Rules />
        <FinalCta />
      </main>
      <SiteFooter />
    </>
  );
}
