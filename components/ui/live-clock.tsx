"use client";

import { useEffect, useState } from "react";

export function LiveClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    function update() {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat("es-AR", {
          timeZone: "America/Argentina/Buenos_Aires",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setTime(formatter.format(now));
      } catch {
        setTime("15:00:00");
      }
    }

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className={`inline-flex items-center gap-1.5 font-mono ${className}`}>
      <span>{time ?? "--:--:--"}</span>
      <span className="text-[10px] text-muted">ART (GMT-3)</span>
    </span>
  );
}
