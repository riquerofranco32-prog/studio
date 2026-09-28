-- Schema for future CMS migration. Not required for the site to run — see lib/supabase.ts.
-- Apply with: supabase db push, or paste into the Supabase SQL editor.

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  year text not null,
  short_description text not null,
  description text not null,
  url text not null,
  featured boolean not null default false,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists project_images (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  image_url text not null,
  alt text not null default '',
  "order" int not null default 0
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  number text not null,
  title text not null,
  description text not null,
  "order" int not null default 0
);

create table if not exists testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  company text not null,
  quote text not null,
  published boolean not null default false,
  "order" int not null default 0
);

create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text not null default '',
  image_url text not null default '',
  linkedin text not null default '',
  "order" int not null default 0
);

create table if not exists site_settings (
  key text primary key,
  value text not null
);

alter table projects enable row level security;
alter table project_images enable row level security;
alter table services enable row level security;
alter table testimonials enable row level security;
alter table team_members enable row level security;
alter table site_settings enable row level security;

create policy "Public read access" on projects for select using (true);
create policy "Public read access" on project_images for select using (true);
create policy "Public read access" on services for select using (true);
create policy "Public read access" on testimonials for select using (published = true);
create policy "Public read access" on team_members for select using (true);
create policy "Public read access" on site_settings for select using (true);
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
