import { useSyncExternalStore } from "react";
import { SITE } from "@/data/site";

const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export function currentMonthName(date = new Date()) {
  return MONTHS[date.getMonth()];
}

export const SLOTS = SITE.availability.slots;

// El mes sale del reloj del visitante: en el server es null y React lo completa
// al hidratar, sin mismatch en los cambios de mes.
const noSubscribe = () => () => {};
export function useMonthName(): string | null {
  return useSyncExternalStore(noSubscribe, currentMonthName, () => null);
}
