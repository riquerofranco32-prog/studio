import { ArrowRight, Mail, MessageCircle } from "lucide-react";
import { InstagramIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Container } from "@/components/ui/container";
import { RevealText } from "@/components/ui/reveal-text";
import { MagneticLink } from "@/components/ui/magnetic-link";
import { SITE } from "@/data/site";

export function FinalCta() {
  return (
    <section id="contact" className="border-t border-border py-24 md:py-40">
      <Container>
        <h2 className="text-5xl font-medium tracking-tight text-foreground md:text-7xl">
          <RevealText>Have an idea?</RevealText>
          <RevealText delay={0.08}>Let&rsquo;s build it.</RevealText>
        </h2>

        <p className="mt-8 max-w-md text-lg text-muted">
          Tell us what you&rsquo;re working on. We&rsquo;ll help turn it into
          something people remember.
        </p>

        <div className="mt-10">
          <MagneticLink
            href={`mailto:${SITE.email}`}
            className="text-2xl font-medium text-foreground md:text-3xl"
          >
            Start a project <ArrowRight size={22} />
          </MagneticLink>
        </div>

        <div className="mt-16 flex flex-wrap gap-x-8 gap-y-4 border-t border-border pt-8">
          <SocialLink
            href={SITE.whatsapp}
            icon={MessageCircle}
            label="WhatsApp"
          />
          <SocialLink href={`mailto:${SITE.email}`} icon={Mail} label="Email" />
          <SocialLink
            href={SITE.social.instagram}
            icon={InstagramIcon}
            label="Instagram"
          />
          <SocialLink
            href={SITE.social.linkedin}
            icon={LinkedinIcon}
            label="LinkedIn"
          />
        </div>
      </Container>
    </section>
  );
}

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: (props: { size?: number }) => React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="focus-ring inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
    >
      <Icon size={16} />
      {label}
    </a>
  );
}
