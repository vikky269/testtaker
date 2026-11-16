-- New simplified parent feedback form fields (3-step survey)
-- Run in Supabase SQL Editor after parent_feedback.sql / parent_feedback_admin_fields.sql

alter table public.parent_feedback
  add column if not exists tutoring_quality text,
  add column if not exists learning_progress text,
  add column if not exists communication_support text,
  add column if not exists works_well text;
