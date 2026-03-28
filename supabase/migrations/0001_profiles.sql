-- Create a table for public profiles
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  display_name text unique,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,

  constraint display_name_length check (char_length(display_name) >= 3 and char_length(display_name) <= 20)
);

-- Set up Row Level Security (RLS)
alter table profiles
  enable row level security;

create policy "Public profiles are viewable by everyone." on profiles
  for select using (true);

create policy "Users can insert their own profile." on profiles
  for insert with check (auth.uid() = id);

create policy "Users can update own profile." on profiles
  for update using (auth.uid() = id);

-- Create a function to handle new user signup
-- (Optional: if you want to automatically create a profile, but here we ask for display name)
