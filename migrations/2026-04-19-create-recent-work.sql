-- Migration: create recent_work table
-- Run with `supabase db query -f migrations/2026-04-19-create-recent-work.sql --linked`

CREATE TABLE IF NOT EXISTS public.recent_work (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  category text,
  type text CHECK (type IN ('image','video')) DEFAULT 'image',
  url text NOT NULL,
  description text,
  uploaded_at timestamptz DEFAULT now()
);

-- Optional index for faster ordering
CREATE INDEX IF NOT EXISTS idx_recent_work_uploaded_at ON public.recent_work (uploaded_at DESC);
