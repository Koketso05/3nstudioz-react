-- Allow public website to read active services
-- Run this in Supabase SQL Editor

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'services'
      AND policyname = 'Allow public read active services'
  ) THEN
    CREATE POLICY "Allow public read active services"
      ON services
      FOR SELECT
      TO anon
      USING (is_active = true);
  END IF;
END $$;
