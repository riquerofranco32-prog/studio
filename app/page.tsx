import { PageTransition } from "@/components/ui/page-transition";
import { Hero } from "@/components/sections/hero";
import { Proof } from "@/components/sections/proof";
import { SelectedWork } from "@/components/sections/selected-work";
import { DeviceShowcase } from "@/components/sections/device-showcase";
import { Services } from "@/components/sections/services";
import { BentoFeatures } from "@/components/sections/bento-features";
import { Process } from "@/components/sections/process";
import { ClientJourney } from "@/components/sections/client-journey";
import { ArchitectureBlueprint } from "@/components/sections/architecture-blueprint";
import { Comparison } from "@/components/sections/comparison";
import { StackComparison } from "@/components/sections/stack-comparison";
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
      <DeviceShowcase />
      <Services />
      <BentoFeatures />
      <Process />
      <ClientJourney />
      <ArchitectureBlueprint />
      <StackComparison />
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
