create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text not null,
  bio text not null,
  image_url text,
  instagram text,
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- Allow anonymous reads (About page is public)
alter table team_members enable row level security;

create policy "Allow public reads"
  on team_members
  for select
  to anon
  using (true);

-- Only authenticated users (admins) can insert/update/delete
create policy "Allow authenticated writes"
  on team_members
  for all
  to authenticated
  using (true)
  with check (true);

-- Seed with initial members (update with real data)
insert into team_members (name, role, bio, image_url, instagram, display_order) values
  (
    'Julias Phahle',
    'Lead Photographer & Founder',
    'With 8+ years of experience, Nkosinathi founded 3NStudioz with a vision to capture South Africa''s most beautiful moments.',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    '',
    1
  ),
  (
    'Naledi Mokoena',
    'Videographer & Editor',
    'Naledi brings cinematic storytelling to every project, specialising in weddings and corporate events.',
    'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400',
    '',
    2
  ),
  (
    'Nhlanhla Zulu',
    'Portrait Photographer',
    'Nhlanhla has a gift for making subjects feel at ease, resulting in natural, expressive portraits.',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    '',
    3
  );
