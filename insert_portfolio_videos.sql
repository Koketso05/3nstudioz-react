-- Insert one video into portfolio_items
-- Replace the URL with the public URL from your Supabase Storage bucket (portfolio/videos/...)
INSERT INTO portfolio_items (title, category, type, url, uploaded_at)
VALUES (
  'Wedding Highlights Reel',
  'weddings',
  'video',
  'https://vdbdscddqmrbkzqokujb.supabase.co/storage/v1/object/public/portfolio/videos/wedding-highlights.mp4',
  CURRENT_DATE
);

-- Insert multiple videos at once
INSERT INTO portfolio_items (title, category, type, url, uploaded_at)
VALUES
  (
    'Corporate Event Recap',
    'corporate',
    'video',
    'https://vdbdscddqmrbkzqokujb.supabase.co/storage/v1/object/public/portfolio/videos/corporate-recap.mp4',
    CURRENT_DATE
  ),
  (
    'Birthday Party Moments',
    'events',
    'video',
    'https://vdbdscddqmrbkzqokujb.supabase.co/storage/v1/object/public/portfolio/videos/birthday-moments.mp4',
    CURRENT_DATE
  ),
  (
    'Couple Shoot Behind The Scenes',
    'portraits',
    'video',
    'https://vdbdscddqmrbkzqokujb.supabase.co/storage/v1/object/public/portfolio/videos/couple-bts.mp4',
    CURRENT_DATE
  );
