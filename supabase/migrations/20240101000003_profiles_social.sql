-- Add social links to profiles
alter table profiles
  add column if not exists linkedin_url text,
  add column if not exists github_url text,
  add column if not exists portfolio_url text,
  add column if not exists avatar_url text;

-- Create a function to get a user's worldwide rank
-- Rank is based on best composite score across all played dates
create or replace function get_user_world_rank(target_user_id uuid)
returns integer
language sql
stable
as $$
  with user_best as (
    select
      user_id,
      min(time_seconds + moves * 5) as best_score
    from scores
    where user_id in (
      select id from profiles where display_name is not null
    )
    group by user_id
  ),
  ranked as (
    select
      user_id,
      rank() over (order by best_score asc) as world_rank
    from user_best
  )
  select world_rank::integer from ranked where user_id = target_user_id
$$;

-- Create a function to get public profile with rank
create or replace function get_public_profile(target_user_id uuid)
returns table (
  id uuid,
  display_name text,
  country_code text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  avatar_url text,
  world_rank bigint,
  total_puzzles_solved bigint,
  best_score integer,
  updated_at timestamptz
)
language sql
stable
as $$
  select
    p.id,
    p.display_name,
    p.country_code,
    p.linkedin_url,
    p.github_url,
    p.portfolio_url,
    p.avatar_url,
    get_user_world_rank(p.id)::bigint as world_rank,
    count(s.id)::bigint as total_puzzles_solved,
    min(s.time_seconds + s.moves * 5) as best_score,
    p.updated_at
  from profiles p
  left join scores s on s.user_id = p.id
  where p.id = target_user_id
  group by p.id, p.display_name, p.country_code, p.linkedin_url, p.github_url, p.portfolio_url, p.avatar_url, p.updated_at
$$;
