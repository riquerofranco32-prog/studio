"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Scroll suave con inercia.
 *
 * Lenis corre SOBRE el scroll nativo: escribe la posición real con
 * `behavior: "instant"` en vez de transformar un wrapper. Por eso siguen
 * funcionando sin tocar nada el IntersectionObserver del navbar, el useScroll
 * del hero, los reveals por viewport y `position: sticky` — que es exactamente
 * lo que rompen las librerías de scroll basadas en transform.
 *
 * Reemplaza a `scroll-behavior: smooth`, que se sacó de globals.css: los
 * frames de Lenis no se pisaban con esa regla, pero sí se pisaba en la
 * restauración de scroll del navegador y en las navegaciones del router.
 *
 * `respectReducedMotion` no se pasa a propósito: viene en `true` por defecto
 * desde 1.3.x y hace lo correcto — fuerza `lerp: 1` para que el scroll siga al
 * input 1:1 y vuelve instantáneos los scrollTo, sin apagar la instancia. Además
 * lee el media query en vivo, sin recargar.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      // 0.1 es el default de la librería: suficiente inercia para que se note,
      // poca como para que el contenido no siga viajando después de soltar.
      lerp: 0.1,
      smoothWheel: true,
      // En touch el scroll queda nativo. syncTouch pelea con el gesto del
      // sistema en iOS y es la fuente principal de reportes de "se siente raro"
      // en mobile; la inercia del dedo ya la da el navegador.
      syncTouch: false,
      // Sin offset a propósito: la compensación del navbar fijo vive en el
      // scroll-margin-top de globals.css. Lenis lo respeta (lenis.mjs:783), y
      // ahí también lo respetan el salto nativo al cargar con hash y el router
      // de Next — que es donde el offset de acá no llegaba. Poner las dos cosas
      // las suma y deja las secciones 160px abajo.
      anchors: true,
      autoRaf: true,
      // Al ir a otra ruta, cortar la inercia: si no, la página nueva hereda la
      // velocidad que traía la anterior.
      stopInertiaOnNavigate: true,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
