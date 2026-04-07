-- Create blocked_dates table for Supabase
CREATE TABLE IF NOT EXISTS blocked_dates (
  id SERIAL PRIMARY KEY,
  blocked_date DATE NOT NULL UNIQUE,
  reason TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security) policies
ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read blocked dates
CREATE POLICY "Users can view blocked dates" ON blocked_dates
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert blocked dates
CREATE POLICY "Users can insert blocked dates" ON blocked_dates
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update their own blocked dates
CREATE POLICY "Users can update blocked dates" ON blocked_dates
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users to delete blocked dates
CREATE POLICY "Users can delete blocked dates" ON blocked_dates
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create index on blocked_date for faster queries
CREATE INDEX IF NOT EXISTS idx_blocked_dates_date ON blocked_dates(blocked_date);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_blocked_dates_updated_at
  BEFORE UPDATE ON blocked_dates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();