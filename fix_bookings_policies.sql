-- Fix bookings permissions for public booking submissions + admin updates
-- Run this in Supabase SQL Editor.

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Public website can create booking requests
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'bookings'
      AND policyname = 'Allow anon insert bookings'
  ) THEN
    CREATE POLICY "Allow anon insert bookings"
      ON bookings
      FOR INSERT
      TO anon
      WITH CHECK (true);
  END IF;
END $$;

-- Authenticated admin users can read bookings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'bookings'
      AND policyname = 'Allow authenticated select bookings'
  ) THEN
    CREATE POLICY "Allow authenticated select bookings"
      ON bookings
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Authenticated admin users can update bookings (confirm/reject)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'bookings'
      AND policyname = 'Allow authenticated update bookings'
  ) THEN
    CREATE POLICY "Allow authenticated update bookings"
      ON bookings
      FOR UPDATE
      TO authenticated
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
