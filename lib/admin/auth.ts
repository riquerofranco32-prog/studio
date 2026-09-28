// Sesión del panel /admin: una cookie httpOnly firmada con HMAC. La
// contraseña sale de ADMIN_PASSWORD (variable de entorno de Vercel): el repo
// es público, así que no puede vivir en el código.
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "se7en_admin";
const TTL_MS = 1000 * 60 * 60 * 24 * 14; // 14 días

function password(): string | null {
  return process.env.ADMIN_PASSWORD || null;
}

function secret(): string | null {
  const p = password();
  if (!p) return null;
  // Si ADMIN_SESSION_SECRET no está, se deriva de la contraseña: cambiarla
  // cierra todas las sesiones abiertas.
  return process.env.ADMIN_SESSION_SECRET || `se7en-admin:${p}`;
}

function sign(value: string, key: string) {
  return createHmac("sha256", key).update(value).digest("base64url");
}

function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function adminConfigured() {
  return Boolean(password());
}

export function checkPassword(input: string) {
  const p = password();
  return Boolean(p) && safeEqual(input, p as string);
}

export async function startSession() {
  const key = secret();
  if (!key) return;
  const exp = String(Date.now() + TTL_MS);
  const store = await cookies();
  store.set(COOKIE, `${exp}.${sign(exp, key)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    expires: new Date(Number(exp)),
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete({ name: COOKIE, path: "/admin" });
}

export async function isAdmin(): Promise<boolean> {
  const key = secret();
  if (!key) return false;
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;
  const [exp, mac] = raw.split(".");
  if (!exp || !mac || Number(exp) < Date.now()) return false;
  return safeEqual(mac, sign(exp, key));
}
