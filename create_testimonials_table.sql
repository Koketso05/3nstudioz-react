-- Create testimonials table for 3NStudioz React app
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  event TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Allow public (anon) read access
CREATE POLICY "Allow public read testimonials" ON testimonials
  FOR SELECT
  TO public
  USING (true);

-- Seed with initial testimonials
INSERT INTO testimonials (name, event, text, rating) VALUES
  ('Sarah & John', 'Wedding', '3NStudioz captured our special day perfectly! Every moment was beautifully preserved.', 5),
  ('Gift Khumalo', 'Wedding', 'Professional, creative, and reliable. Highly recommend for any business event.', 5),
  ('Mothusi Bahlekazi', 'Birthday Party', 'The photos were stunning! They made our celebration unforgettable.', 5);
