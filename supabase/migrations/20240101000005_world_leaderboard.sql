-- Create a view for the Global World Rankings
-- Rankings are based on each user's single BEST composite score ever.

create or replace view world_leaderboard as
with user_best_scores as (
  -- For each user, find their best (minimum) composite score ever
  select
    user_id,
    min(time_seconds + (moves * 5)) as best_score,
    count(*) as total_solved,
    max(created_at) as last_solve_at
  from scores
  group by user_id
),
ranked_users as (
  -- Rank users based on that best score
  select
    ubs.user_id,
    ubs.best_score,
    ubs.total_solved,
    ubs.last_solve_at,
    rank() over (order by ubs.best_score asc, ubs.total_solved desc, ubs.last_solve_at asc) as global_rank
  from user_best_scores ubs
  join profiles p on p.id = ubs.user_id
  where p.display_name is not null
)
select
  ru.user_id,
  ru.best_score,
  ru.total_solved,
  ru.last_solve_at,
  ru.global_rank as world_rank,
  p.display_name,
  p.country_code,
  p.avatar_url
from ranked_users ru
join profiles p on p.id = ru.user_id
order by ru.global_rank asc;

-- Grant select on the view to public and authenticated users
GRANT SELECT ON public.world_leaderboard TO anon, authenticated;
