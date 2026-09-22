"use client";

import { useEffect } from "react";
import { SITE } from "@/data/site";

// Guiño para quien abre las devtools por curiosidad: un mensaje real, sin
// nada fabricado, con la forma de contactarnos directo.
export function ConsoleEasterEgg() {
  useEffect(() => {
    console.log(
      "%c( ( ( SE7EN",
      "color: #ff4d2e; font-weight: bold; font-size: 20px; font-family: monospace;",
    );
    console.log(
      "%c¿Abriste la consola? Nos gusta la gente curiosa.",
      "color: #a0a0a0; font-size: 13px;",
    );
    console.log(
      `%cSi te copás con el código, escribinos: ${SITE.email}`,
      "color: #a0a0a0; font-size: 13px;",
    );
  }, []);

  return null;
}
