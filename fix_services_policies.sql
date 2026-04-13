-- Reset services policies to avoid conflicting legacy rules
-- Run this in Supabase SQL Editor

ALTER TABLE services ENABLE ROW LEVEL SECURITY;

DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'services'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.services', policy_record.policyname);
  END LOOP;
END $$;

-- Public website can read active services
CREATE POLICY "Allow public read active services"
  ON services
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Authenticated admin users can read all services
CREATE POLICY "Allow authenticated read services"
  ON services
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admin users can insert services
CREATE POLICY "Allow authenticated insert services"
  ON services
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated admin users can update services
CREATE POLICY "Allow authenticated update services"
  ON services
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated admin users can delete services
CREATE POLICY "Allow authenticated delete services"
  ON services
  FOR DELETE
  TO authenticated
  USING (true);
