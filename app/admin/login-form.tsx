"use client";

import { useActionState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { login, type LoginState } from "./actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form
      action={action}
      className="w-full max-w-sm rounded-2xl border border-border bg-surface p-8 shadow-[0_30px_80px_-40px_rgba(255,77,46,0.35)]"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background text-accent">
        <Lock size={18} />
      </span>
      <h1 className="mt-5 text-2xl text-foreground">Panel del estudio</h1>
      <p className="mt-1.5 text-sm text-muted">Sólo para Franco y Federico.</p>

      <label htmlFor="password" className="mt-7 mb-2 block font-mono text-[11px] tracking-widest text-muted uppercase">
        Contraseña
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        aria-invalid={Boolean(state.error)}
        className="focus-ring w-full rounded-lg border border-border bg-background px-4 py-3 text-foreground focus:border-accent aria-[invalid=true]:border-red-500/60"
      />
      {state.error && <p className="mt-2 text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="focus-ring mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-background transition-opacity disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
        <ArrowRight size={15} />
      </button>
    </form>
  );
}
