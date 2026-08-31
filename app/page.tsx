import { PageTransition } from "@/components/ui/page-transition";
import { Hero } from "@/components/sections/hero";
import { TechMarquee } from "@/components/ui/tech-marquee";
import { Proof } from "@/components/sections/proof";
import { SelectedWork } from "@/components/sections/selected-work";
import { DeviceShowcase } from "@/components/sections/device-showcase";
import { Services } from "@/components/sections/services";
import { StartupEngine } from "@/components/sections/startup-engine";
import { Process } from "@/components/sections/process";
import { About } from "@/components/sections/about";
import { Testimonials } from "@/components/sections/testimonials";
import { ProjectEstimator } from "@/components/sections/project-estimator";
import { FAQ } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <TechMarquee />
      <Proof />
      <SelectedWork />
      <DeviceShowcase />
      <Services />
      <StartupEngine />
      <Process />
      <About />
      <Testimonials />
      <ProjectEstimator />
      <FAQ />
      <Contact />
    </PageTransition>
  );
}
