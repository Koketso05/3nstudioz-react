-- Add explicit booking status so admin can confirm or reject requests
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending'
CHECK (status IN ('pending', 'confirmed', 'rejected'));

-- Backfill existing rows based on confirmed boolean
UPDATE bookings
SET status = CASE WHEN confirmed THEN 'confirmed' ELSE 'pending' END
WHERE status IS NULL OR status = '';
