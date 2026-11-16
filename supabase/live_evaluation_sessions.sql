-- Live evaluation sessions: pause/resume + admin live monitor
-- Run once in the Supabase SQL Editor

create table if not exists public.live_evaluation_sessions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_seen_at timestamptz not null default now(),

  student_id text,
  student_name text not null default 'Student',
  student_email text,
  student_gender text,

  assessment_type text not null default 'quiz',
  assessment_label text,
  grade text,
  section text,
  test_id text,

  status text not null default 'active'
    check (status in ('active', 'pause_requested', 'paused', 'completed', 'abandoned')),

  total_questions int not null default 0,
  questions_attempted int not null default 0,
  current_question_index int not null default 0,
  answers_count int not null default 0,

  timer_total_seconds int not null default 0,
  timer_remaining_seconds int not null default 0,
  timer_ends_at timestamptz,
  pause_reason text,
  paused_at timestamptz,
  resumed_at timestamptz,
  completed_at timestamptz,

  client_key text
);

create index if not exists live_eval_status_idx
  on public.live_evaluation_sessions (status, updated_at desc);

create index if not exists live_eval_student_idx
  on public.live_evaluation_sessions (student_id, created_at desc);

create index if not exists live_eval_client_key_idx
  on public.live_evaluation_sessions (client_key);

create or replace function public.set_live_eval_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists live_eval_set_updated_at on public.live_evaluation_sessions;
create trigger live_eval_set_updated_at
  before update on public.live_evaluation_sessions
  for each row execute function public.set_live_eval_updated_at();

alter table public.live_evaluation_sessions enable row level security;

-- Students (anon + authenticated) can create sessions
drop policy if exists "Anyone can insert live eval sessions" on public.live_evaluation_sessions;
create policy "Anyone can insert live eval sessions"
  on public.live_evaluation_sessions
  for insert
  to anon, authenticated
  with check (true);

-- Anyone can read (admin monitor + student self-check). Tighten later if needed.
drop policy if exists "Anyone can read live eval sessions" on public.live_evaluation_sessions;
create policy "Anyone can read live eval sessions"
  on public.live_evaluation_sessions
  for select
  to anon, authenticated
  using (true);

-- Students and admin can update (pause request, heartbeat, admin grant/resume)
drop policy if exists "Anyone can update live eval sessions" on public.live_evaluation_sessions;
create policy "Anyone can update live eval sessions"
  on public.live_evaluation_sessions
  for update
  to anon, authenticated
  using (true)
  with check (true);

-- Admin cleanup
drop policy if exists "Authenticated can delete live eval sessions" on public.live_evaluation_sessions;
create policy "Authenticated can delete live eval sessions"
  on public.live_evaluation_sessions
  for delete
  to authenticated
  using (true);

-- Realtime (ignore error if already added)
do $$
begin
  begin
    alter publication supabase_realtime add table public.live_evaluation_sessions;
  exception when duplicate_object then
    null;
  end;
end $$;
