import { Hero } from "@/components/sections/hero";
import { SelectedWork } from "@/components/sections/selected-work";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { About } from "@/components/sections/about";
import { Technology } from "@/components/sections/technology";
import { Testimonials } from "@/components/sections/testimonials";
import { FinalCta } from "@/components/sections/final-cta";

export default function Home() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Services />
      <Process />
      <About />
      <Technology />
      <Testimonials />
      <FinalCta />
    </>
  );
}
