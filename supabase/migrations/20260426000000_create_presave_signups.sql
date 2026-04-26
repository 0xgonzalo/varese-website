-- Stores presave/event signups from the Tregua Remixes hero form
create table if not exists public.presave_signups (
  id          uuid primary key default gen_random_uuid(),
  first_name  text not null,
  last_name   text not null,
  event       smallint not null check (event in (1, 2, 3)),
  email       text not null,
  presave_completed boolean not null default false,
  created_at  timestamptz not null default now()
);

create index if not exists presave_signups_event_idx on public.presave_signups(event);
create index if not exists presave_signups_email_idx on public.presave_signups(email);

-- Enable RLS so anon can only insert (no read)
alter table public.presave_signups enable row level security;

drop policy if exists "anon insert presave_signups" on public.presave_signups;
create policy "anon insert presave_signups"
  on public.presave_signups
  for insert
  to anon
  with check (true);
