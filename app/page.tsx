import { PageTransition } from "@/components/ui/page-transition";
import { Hero } from "@/components/sections/hero";
import { Proof } from "@/components/sections/proof";
import { SelectedWork } from "@/components/sections/selected-work";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { Comparison } from "@/components/sections/comparison";
import { About } from "@/components/sections/about";
import { Testimonials } from "@/components/sections/testimonials";
import { Technology } from "@/components/sections/technology";
import { ProjectEstimator } from "@/components/sections/project-estimator";
import { FAQ } from "@/components/sections/faq";
import { CtaBanner } from "@/components/sections/cta-banner";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <Proof />
      <SelectedWork />
      <Services />
      <Process />
      <Comparison />
      <About />
      <Testimonials />
      <Technology />
      <ProjectEstimator />
      <FAQ />
      <CtaBanner />
      <Contact />
    </PageTransition>
  );
}
