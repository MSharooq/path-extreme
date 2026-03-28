-- Update world_leaderboard to use Bayesian Average logic
-- WR = (v * R + m * C) / (v + m)
-- v: solve count, m: 5, R: user average, C: global average

drop view if exists world_leaderboard;

create or replace view world_leaderboard as
with globals as (
  select coalesce(avg(time_seconds + (moves * 5)), 0)::float as global_avg
  from scores
),
user_stats as (
  select
    user_id,
    avg(time_seconds + (moves * 5))::float as user_avg,
    min(time_seconds + (moves * 5)) as best_score,
    count(*) as total_solved,
    max(created_at) as last_solve_at
  from scores
  group by user_id
),
bayesian_ranks as (
  select
    us.user_id,
    us.user_avg,
    us.best_score,
    us.total_solved,
    us.last_solve_at,
    (
      (us.total_solved::float * us.user_avg) + (5.0 * g.global_avg)
    ) / (us.total_solved::float + 5.0) as skill_rating
  from user_stats us
  cross join globals g
  join profiles p on p.id = us.user_id
  where p.display_name is not null
),
ranked_users as (
  select
    br.*,
    rank() over (order by br.skill_rating asc, br.total_solved desc, br.last_solve_at asc) as global_rank
  from bayesian_ranks br
)
select
  ru.user_id,
  ru.best_score,
  ru.total_solved,
  ru.last_solve_at,
  ru.skill_rating,
  ru.global_rank as world_rank,
  p.display_name,
  p.country_code,
  p.avatar_url
from ranked_users ru
join profiles p on p.id = ru.user_id
order by ru.global_rank asc;

GRANT SELECT ON public.world_leaderboard TO anon, authenticated;
