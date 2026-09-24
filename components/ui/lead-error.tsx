interface LeadErrorProps {
  error: string | null;
  whatsappUrl: string;
}

// Error de envío con salida alternativa: el lead nunca se pierde en silencio.
export function LeadError({ error, whatsappUrl }: LeadErrorProps) {
  if (!error) return null;
  return (
    <p
      role="alert"
      className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs leading-relaxed text-foreground"
    >
      {error}{" "}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="focus-ring font-semibold text-accent underline underline-offset-2"
      >
        Abrir WhatsApp →
      </a>
    </p>
  );
}
