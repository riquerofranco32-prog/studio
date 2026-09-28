-- Pedidos de proyecto que llegan desde los formularios del sitio. Los lee y
-- los edita el panel /admin.
-- Aplicar pegando este archivo en el SQL editor de Supabase.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- De qué formulario vino (contacto, start, kickoff, auditoría, reserva…)
  -- y por dónde siguió la charla (email / whatsapp).
  source text not null default 'web',
  channel text,
  name text not null,
  email text not null default '',
  company text not null default '',
  project_type text not null default '',
  budget text not null default '',
  timeline text not null default '',
  idea text not null default '',
  -- Gestión interna.
  status text not null default 'nuevo'
    check (status in ('nuevo', 'contactado', 'propuesta', 'ganado', 'perdido')),
  owner text check (owner in ('franco', 'federico')),
  notes text not null default ''
);

create index if not exists leads_created_at_idx on leads (created_at desc);

-- Sin políticas públicas: con RLS activo y sin policies, nadie con la anon
-- key puede leer ni escribir. Sólo el servidor, con la service role key.
alter table leads enable row level security;
