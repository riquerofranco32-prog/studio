import { PageTransition } from "@/components/ui/page-transition";
import { Hero } from "@/components/sections/hero";
import { Proof } from "@/components/sections/proof";
import { SelectedWork } from "@/components/sections/selected-work";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { About } from "@/components/sections/about";
import { Technology } from "@/components/sections/technology";
import { FAQ } from "@/components/sections/faq";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Proof />
      <SelectedWork />
      <Services />
      <Process />
      <About />
      <Technology />
      <FAQ />
      <Testimonials />
      <Contact />
    </PageTransition>
  );
}
