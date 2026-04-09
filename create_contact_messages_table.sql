create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  created_at timestamptz not null default now()
);

-- Allow anonymous inserts (contact form submissions)
alter table contact_messages enable row level security;

create policy "Allow anonymous inserts"
  on contact_messages
  for insert
  to anon
  with check (true);

-- Only authenticated users (admins) can read messages
create policy "Allow authenticated reads"
  on contact_messages
  for select
  to authenticated
  using (true);
