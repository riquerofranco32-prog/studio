"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

interface ParallaxImage {
  src: string;
  alt: string;
  href?: string;
}

/**
 * Collage que se acerca con el scroll: cada imagen tiene su propio
 * multiplicador de escala y una posición fija armada para 7 elementos
 * (índice 0 = centro/protagonista, 1-6 = alrededor). Adaptación de un
 * patrón conocido de "zoom parallax", con framer-motion (ya en el
 * proyecto) y sin Lenis — el scroll suave global ya lo resuelve
 * <SmoothScroll /> en el layout.
 */
export function ZoomParallax({ images }: { images: ParallaxImage[] }) {
  const container = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  const scale4 = useTransform(scrollYProgress, [0, 1], [1, 4]);
  const scale5 = useTransform(scrollYProgress, [0, 1], [1, 5]);
  const scale6 = useTransform(scrollYProgress, [0, 1], [1, 6]);
  const scale8 = useTransform(scrollYProgress, [0, 1], [1, 8]);
  const scale9 = useTransform(scrollYProgress, [0, 1], [1, 9]);
  const scales = [scale4, scale5, scale6, scale5, scale6, scale8, scale9];

  const items = images.slice(0, 7);

  if (reduceMotion) {
    return (
      <div className="grid grid-cols-2 gap-3 px-6 py-16 sm:grid-cols-3 md:grid-cols-4">
        {items.map((img) => (
          <Content key={img.src} img={img} className="!static !h-40 !w-full" />
        ))}
      </div>
    );
  }

  return (
    <div ref={container} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        {items.map((img, index) => (
          <motion.div
            key={img.src}
            style={{ scale: scales[index % scales.length] }}
            className={`absolute top-0 flex h-full w-full items-center justify-center ${
              index === 1
                ? "[&>div]:!-top-[30vh] [&>div]:!left-[5vw] [&>div]:!h-[30vh] [&>div]:!w-[35vw]"
                : ""
            } ${
              index === 2
                ? "[&>div]:!-top-[10vh] [&>div]:!-left-[25vw] [&>div]:!h-[45vh] [&>div]:!w-[20vw]"
                : ""
            } ${
              index === 3
                ? "[&>div]:!left-[27.5vw] [&>div]:!h-[25vh] [&>div]:!w-[25vw]"
                : ""
            } ${
              index === 4
                ? "[&>div]:!top-[27.5vh] [&>div]:!left-[5vw] [&>div]:!h-[25vh] [&>div]:!w-[20vw]"
                : ""
            } ${
              index === 5
                ? "[&>div]:!top-[27.5vh] [&>div]:!-left-[22.5vw] [&>div]:!h-[25vh] [&>div]:!w-[30vw]"
                : ""
            } ${
              index === 6
                ? "[&>div]:!top-[22.5vh] [&>div]:!left-[25vw] [&>div]:!h-[15vh] [&>div]:!w-[15vw]"
                : ""
            }`}
          >
            <Content img={img} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function Content({
  img,
  className = "",
}: {
  img: ParallaxImage;
  className?: string;
}) {
  const body = (
    <div
      className={`relative h-[25vh] w-[25vw] overflow-hidden rounded-xl border border-border ${className}`}
    >
      <Image
        src={img.src}
        alt={img.alt}
        fill
        sizes="35vw"
        className="object-cover"
      />
    </div>
  );

  return img.href ? (
    <Link href={img.href} className="focus-ring">
      {body}
    </Link>
  ) : (
    body
  );
}
