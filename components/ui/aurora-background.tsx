// Dos orbes de luz que flotan detrás de todo el sitio.
//
// Corre montado y animando en TODAS las páginas todo el tiempo. Por eso va en
// CSS puro (keyframes de transform en globals.css, clase .aurora-orb): el
// navegador lo resuelve en el compositor, sin JS por cuadro, y con
// will-change el blur se rasteriza una sola vez en lugar de repintarse en
// cada cuadro. Con prefers-reduced-motion la regla global corta la animación.
export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden opacity-40"
    >
      {/* Orb superior izquierdo (acento) */}
      <div className="aurora-orb aurora-a absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-radial from-accent/25 via-accent/5 to-transparent blur-[64px]" />
      {/* Orb inferior derecho */}
      <div className="aurora-orb aurora-b absolute top-1/2 -right-40 h-[600px] w-[600px] rounded-full bg-radial from-[#ff7a59]/15 via-transparent to-transparent blur-[72px]" />
    </div>
  );
}
