"use client";

import { RefObject, useEffect, useState } from "react";

// ponytail: framer-motion's whileInView doesn't fire reliably in this project's setup (v13 + Next 16 Turbopack) —
// a plain IntersectionObserver is the smaller, verified-working fix. Revisit whileInView if the library patches it.
export function useInView(ref: RefObject<Element | null>, amount = 0.2) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: amount },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, amount]);

  return inView;
}
