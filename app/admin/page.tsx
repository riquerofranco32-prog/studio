import type { Metadata } from "next";
import { connection } from "next/server";
import { adminConfigured, isAdmin } from "@/lib/admin/auth";
import { db, listLeads, type Lead } from "@/lib/admin/db";
import { LoginForm } from "./login-form";
import { Dashboard } from "./dashboard";

// Panel interno de Franco y Federico: los pedidos que llegan por los
// formularios del sitio, en un tablero para responderlos y darles
// seguimiento. Fuera de buscadores (robots.ts también lo excluye).
export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // Siempre por pedido: la sesión y los pedidos no pueden quedar congelados
  // en el build.
  await connection();
  if (!adminConfigured()) {
    return (
      <Shell>
        <Notice title="Falta la contraseña del panel">
          Cargá la variable <code>ADMIN_PASSWORD</code> en Vercel (Settings → Environment
          Variables) y volvé a deployar. No va en el código porque el repositorio es público.
        </Notice>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <LoginForm />
      </Shell>
    );
  }

  const ready = db() !== null;
  let leads: Lead[] = [];
  let error: string | null = null;
  if (ready) {
    try {
      leads = await listLeads();
    } catch (e) {
      error = e instanceof Error ? e.message : "Error leyendo los pedidos";
    }
  }
  return <Dashboard leads={leads} dbReady={ready} error={error} />;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-6 pt-24 pb-16">{children}</div>
  );
}

function Notice({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="max-w-md rounded-2xl border border-border bg-surface p-8">
      <p className="font-mono text-[11px] tracking-widest text-accent uppercase">Panel</p>
      <h1 className="mt-3 text-2xl text-foreground">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted [&_code]:rounded [&_code]:bg-background [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-foreground">
        {children}
      </p>
    </div>
  );
}
