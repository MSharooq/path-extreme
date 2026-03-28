-- Add country to profiles
alter table profiles
  add column if not exists country_code text; -- e.g. 'US', 'IN', 'GB'

-- Create scores table
create table if not exists scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) on delete cascade not null,
  puzzle_date date not null,
  time_seconds integer not null, -- lower is better
  moves integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- One score per user per puzzle date
  unique(user_id, puzzle_date)
);

-- RLS on scores
alter table scores enable row level security;

create policy "Scores are viewable by everyone." on scores
  for select using (true);

create policy "Authenticated users can insert their own score." on scores
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own score." on scores
  for update using (auth.uid() = user_id);

-- Create a leaderboard view that joins scores with profiles
-- Score is calculated as: lower time is better, penalise moves slightly
create or replace view leaderboard as
  select
    s.id,
    s.user_id,
    s.puzzle_date,
    s.time_seconds,
    s.moves,
    s.created_at,
    p.display_name,
    p.country_code,
    -- Composite score: time + (moves * 5) – lower is better
    (s.time_seconds + s.moves * 5) as composite_score,
    -- rank within that puzzle date
    rank() over (partition by s.puzzle_date order by (s.time_seconds + s.moves * 5) asc) as date_rank
  from scores s
  join profiles p on p.id = s.user_id
  where p.display_name is not null;
