-- Fix bookings permissions for public booking submissions + admin updates
-- Run this in Supabase SQL Editor.

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Remove all existing policies on bookings to avoid conflicts
DO $$
DECLARE
  policy_record RECORD;
BEGIN
  FOR policy_record IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'bookings'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.bookings', policy_record.policyname);
  END LOOP;
END $$;

-- Ensure status column exists for confirm/reject workflow
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'confirmed', 'rejected'));

UPDATE bookings
SET status = CASE WHEN confirmed THEN 'confirmed' ELSE 'pending' END
WHERE status IS NULL OR status = '';

-- Public website can create booking requests
CREATE POLICY "Allow anon insert bookings"
  ON bookings
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Authenticated admin users can read bookings
CREATE POLICY "Allow authenticated select bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (true);

-- Authenticated admin users can update bookings (confirm/reject)
CREATE POLICY "Allow authenticated update bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Optional: allow authenticated admins to delete bookings if needed later
CREATE POLICY "Allow authenticated delete bookings"
  ON bookings
  FOR DELETE
  TO authenticated
  USING (true);
