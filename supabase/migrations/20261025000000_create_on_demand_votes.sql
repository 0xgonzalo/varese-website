-- Votes for "Varese On Demand" (04.11). One row per track per submission.
create table if not exists public.on_demand_votes (
  id             uuid primary key default gen_random_uuid(),
  submission_id  uuid not null,
  track          text not null check (char_length(track) between 1 and 200),
  created_at     timestamptz not null default now()
);

create index if not exists on_demand_votes_track_idx on public.on_demand_votes(track);

-- RLS: anon can only insert, never read
alter table public.on_demand_votes enable row level security;

drop policy if exists "anon insert on_demand_votes" on public.on_demand_votes;
create policy "anon insert on_demand_votes"
  on public.on_demand_votes
  for insert
  to anon
  with check (true);

-- Ranking (read from the dashboard / SQL editor; security_invoker keeps it closed to anon)
create or replace view public.on_demand_ranking
with (security_invoker = true) as
select track, count(*)::int as votes
from public.on_demand_votes
group by track
order by votes desc, track asc;
