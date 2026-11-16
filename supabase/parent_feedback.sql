-- Parent feedback survey responses (from smartmathz-survey-deploy)
-- Run this once in the Supabase SQL Editor for project vxpbgsvtjfjgaachjpwc

create table if not exists public.parent_feedback (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),

  parent_name text,
  parent_email text,
  student_names text[] default '{}',
  status text not null default 'new',
  admin_notes text,
  tags text[] default '{}',
  updated_at timestamptz default now(),
  tenure text,
  subjects text[] default '{}',
  subject_other text,

  -- Simplified 3-step survey
  tutoring_quality text,
  learning_progress text,
  communication_support text,
  works_well text,

  teaching_ratings jsonb default '{}'::jsonb,
  enjoy text,
  appreciate_tutor text,

  progress text,
  improvements text[] default '{}',
  improvement_other text,
  reports text,
  alignment text,
  focus_areas text,

  admin_ratings jsonb default '{}'::jsonb,
  responsiveness text,
  challenges text,
  challenge_details text,

  overall text,
  nps int,
  strength text,
  improve text,
  services text[] default '{}',
  service_other text,

  additional text,
  followup text
);

create index if not exists parent_feedback_created_at_idx
  on public.parent_feedback (created_at desc);

alter table public.parent_feedback enable row level security;

-- Public survey can insert (anon + authenticated)
drop policy if exists "Anyone can insert parent feedback" on public.parent_feedback;
create policy "Anyone can insert parent feedback"
  on public.parent_feedback
  for insert
  to anon, authenticated
  with check (true);

-- Admins / signed-in users can read
drop policy if exists "Authenticated can read parent feedback" on public.parent_feedback;
create policy "Authenticated can read parent feedback"
  on public.parent_feedback
  for select
  to authenticated
  using (true);

-- Optional: allow authenticated delete from admin UI
drop policy if exists "Authenticated can delete parent feedback" on public.parent_feedback;
create policy "Authenticated can delete parent feedback"
  on public.parent_feedback
  for delete
  to authenticated
  using (true);

drop policy if exists "Authenticated can update parent feedback" on public.parent_feedback;
create policy "Authenticated can update parent feedback"
  on public.parent_feedback
  for update
  to authenticated
  using (true)
  with check (true);
