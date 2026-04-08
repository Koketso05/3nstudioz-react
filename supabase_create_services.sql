-- Create services table for 3NStudioz React app
-- Run this script in your Supabase SQL Editor

-- Create the services table
CREATE TABLE IF NOT EXISTS services (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('photography', 'videography')),
  price TEXT NOT NULL,
  duration TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admin only)
-- This allows only logged-in users to manage services
CREATE POLICY "Allow authenticated users to manage services" ON services
  FOR ALL TO authenticated USING (true);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert the sample data
INSERT INTO services (name, type, price, duration, features, is_active) VALUES
  ('Basic Photography Package', 'photography', 'R2,500', '2-3 hours', ARRAY['Up to 3 hours coverage', '100+ edited photos', 'Online gallery', 'High-resolution digital files'], true),
  ('Premium Photography Package', 'photography', 'R5,000', 'Full day', ARRAY['Full day coverage (8 hours)', '300+ edited photos', 'Online gallery', 'Printed photo album', 'Second photographer'], true),
  ('Highlights Videography Package', 'videography', 'R3,500', '2-3 hours', ARRAY['Up to 3 hours filming', '3-5 minute highlight video', 'Professional editing', '4K resolution'], true),
  ('Full Coverage Videography Package', 'videography', 'R7,000', 'Full day', ARRAY['Full day filming', '10-15 minute feature film', 'Professional editing', 'Second videographer'], true);