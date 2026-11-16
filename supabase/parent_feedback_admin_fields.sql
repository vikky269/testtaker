-- Run after parent_feedback.sql — adds admin workflow fields for the details page

alter table public.parent_feedback
  add column if not exists status text not null default 'new',
  add column if not exists admin_notes text,
  add column if not exists tags text[] default '{}',
  add column if not exists parent_email text,
  add column if not exists updated_at timestamptz default now();

-- Keep status values constrained
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'parent_feedback_status_check'
  ) then
    alter table public.parent_feedback
      add constraint parent_feedback_status_check
      check (status in ('new', 'reviewed', 'follow_up', 'closed'));
  end if;
end $$;

create index if not exists parent_feedback_status_idx
  on public.parent_feedback (status);

drop policy if exists "Authenticated can update parent feedback" on public.parent_feedback;
create policy "Authenticated can update parent feedback"
  on public.parent_feedback
  for update
  to authenticated
  using (true)
  with check (true);
