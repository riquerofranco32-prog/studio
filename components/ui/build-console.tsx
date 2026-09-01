// Visual del hero: un panel de consola que muestra el entorno de staging real
// que se entrega en el Paso 02 del proceso (ver components/sections/process.tsx).
// Las líneas de log usan sólo afirmaciones que ya sostenemos en otras
// secciones (Lighthouse 100, TypeScript estricto, repo propio) — nada
// inventado para este componente.
export function BuildConsole() {
  return (
    <div className="relative">
      <span
        aria-hidden
        className="absolute -top-px -left-px h-5 w-5 rounded-tl-2xl border-t border-l border-accent/50"
      />
      <span
        aria-hidden
        className="absolute -right-px -bottom-px h-5 w-5 rounded-br-2xl border-r border-b border-accent/50"
      />

      <div className="overflow-hidden rounded-2xl border border-border bg-surface/80 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            staging.tuproyecto.com
          </div>
          <span className="font-mono text-[10px] text-muted">en vivo</span>
        </div>

        <div className="space-y-2.5 px-4 py-5 font-mono text-[13px] leading-relaxed">
          <p className="text-muted">$ vercel deploy --staging</p>
          <p className="text-foreground">
            <span className="text-accent">✓</span> Entorno de staging listo
          </p>
          <p className="text-foreground">
            <span className="text-accent">✓</span> TypeScript estricto, 0
            errores
          </p>
          <p className="text-foreground">
            <span className="text-accent">✓</span> Base de datos conectada
            (Supabase)
          </p>
          <p className="mt-3 text-muted">$ lighthouse --audit</p>
          <p className="text-foreground">
            <span className="text-accent">✓</span> Performance{" "}
            <span className="text-accent">100</span> · Accesibilidad{" "}
            <span className="text-accent">100</span>
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-border px-4 py-3 font-mono text-[11px] text-muted">
          <span>Next.js 16 · Turbopack</span>
          <span className="text-accent">Repo 100% tuyo</span>
        </div>
      </div>
    </div>
  );
}
