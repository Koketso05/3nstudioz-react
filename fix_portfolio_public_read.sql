-- Fix portfolio visibility for public website
-- Run in Supabase SQL Editor as project owner.

-- 1) Ensure portfolio_items allows anonymous/public SELECT
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'portfolio_items'
      AND policyname = 'Allow public read portfolio items'
  ) THEN
    CREATE POLICY "Allow public read portfolio items"
      ON portfolio_items
      FOR SELECT
      TO public
      USING (true);
  END IF;
END $$;

-- 2) Ensure storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('portfolio', 'portfolio', true)
ON CONFLICT (id) DO UPDATE
SET public = true;

-- 3) Allow public read from all objects in the portfolio bucket
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'storage'
      AND tablename = 'objects'
      AND policyname = 'Public read portfolio bucket objects'
  ) THEN
    CREATE POLICY "Public read portfolio bucket objects"
      ON storage.objects
      FOR SELECT
      TO public
      USING (bucket_id = 'portfolio');
  END IF;
END $$;
