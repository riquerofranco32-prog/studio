"use server";

import { revalidatePath } from "next/cache";
import { checkPassword, endSession, isAdmin, startSession } from "@/lib/admin/auth";
import { OWNERS, STATUSES, patchLead, removeLead, type LeadOwner, type LeadStatus } from "@/lib/admin/db";

export type LoginState = { error?: string };

export async function login(_: LoginState, form: FormData): Promise<LoginState> {
  const pass = String(form.get("password") ?? "");
  // Pausa fija: frena probar contraseñas a mano en ráfaga.
  await new Promise((r) => setTimeout(r, 400));
  if (!checkPassword(pass)) return { error: "Contraseña incorrecta." };
  await startSession();
  revalidatePath("/admin");
  return {};
}

export async function logout() {
  await endSession();
  revalidatePath("/admin");
}

async function guard() {
  if (!(await isAdmin())) throw new Error("Sesión vencida: volvé a entrar.");
}

export async function setStatus(id: string, status: LeadStatus) {
  await guard();
  if (!STATUSES.includes(status)) throw new Error("Estado inválido");
  await patchLead(id, { status });
  revalidatePath("/admin");
}

export async function setOwner(id: string, owner: LeadOwner | null) {
  await guard();
  if (owner !== null && !OWNERS.includes(owner)) throw new Error("Responsable inválido");
  await patchLead(id, { owner });
  revalidatePath("/admin");
}

export async function setNotes(id: string, notes: string) {
  await guard();
  await patchLead(id, { notes: notes.slice(0, 5000) });
  revalidatePath("/admin");
}

export async function deleteLead(id: string) {
  await guard();
  await removeLead(id);
  revalidatePath("/admin");
}
