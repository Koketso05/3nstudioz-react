-- Seed recent_work with the four hardcoded homepage images
INSERT INTO public.recent_work (title, category, type, url, description)
VALUES
  ('711A2748', 'featured', 'image', 'https://res.cloudinary.com/djqvmg7pb/image/upload/v1775557926/711A2748_pr1wck.jpg', 'Homepage hero image'),
  ('711A1976', 'featured', 'image', 'https://res.cloudinary.com/djqvmg7pb/image/upload/v1775562017/711A1976_yymhwv.jpg', 'Portfolio preview'),
  ('711A3880', 'featured', 'image', 'https://res.cloudinary.com/djqvmg7pb/image/upload/v1776632695/711A3880_bfb9hu.jpg', 'Portfolio preview'),
  ('711A5115', 'featured', 'image', 'https://res.cloudinary.com/djqvmg7pb/image/upload/v1775563403/711A5115_gjmr1t.jpg', 'Portfolio preview');
