-- Create portfolio_items table for 3NStudioz React app
CREATE TABLE IF NOT EXISTS portfolio_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  uploaded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to manage portfolio items
CREATE POLICY "Allow authenticated users to manage portfolio items" ON portfolio_items
  FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_portfolio_items_updated_at
  BEFORE UPDATE ON portfolio_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Optional seed data for initial portfolio categories and items
INSERT INTO portfolio_items (title, category, type, url, uploaded_at)
VALUES
  ('Wedding Portrait', 'weddings', 'image', 'https://images.unsplash.com/photo-1647730346047-649e23e3c7fa?w=400', '2026-03-15'),
  ('Concert Performance', 'events', 'image', 'https://images.unsplash.com/photo-1575112165295-29b81f5f269e?w=400', '2026-03-10'),
  ('Professional Portrait', 'portraits', 'image', 'https://images.unsplash.com/photo-1532272278764-53cd1fe53f72?w=400', '2026-03-05'),
  ('Corporate Office', 'corporate', 'image', 'https://images.unsplash.com/photo-1603201667493-4c2696de0b1f?w=400', '2026-03-01');
