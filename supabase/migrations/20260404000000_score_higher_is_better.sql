-- Update get_public_profile to use 10000 - base penalty for best_score
CREATE OR REPLACE FUNCTION public.get_public_profile(target_user_id uuid)
 RETURNS TABLE(id uuid, display_name text, country_code text, linkedin_url text, github_url text, portfolio_url text, avatar_url text, world_rank bigint, total_puzzles_solved bigint, best_score integer, updated_at timestamp with time zone)
 LANGUAGE sql
 STABLE
AS $function$
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
    max(GREATEST(0, 10000 - (s.time_seconds + s.moves * 5))) as best_score,
    p.updated_at
  from profiles p
  left join scores s on s.user_id = p.id
  where p.id = target_user_id
  group by p.id, p.display_name, p.country_code, p.linkedin_url, p.github_url, p.portfolio_url, p.avatar_url, p.updated_at
$function$
;

-- Update get_user_world_rank to rank best_score DESC
CREATE OR REPLACE FUNCTION public.get_user_world_rank(target_user_id uuid)
 RETURNS integer
 LANGUAGE sql
 STABLE
AS $function$
  with user_best as (
    select
      user_id,
      max(GREATEST(0, 10000 - (time_seconds + moves * 5))) as best_score
    from scores
    where user_id in (
      select id from profiles where display_name is not null
    )
    group by user_id
  ),
  ranked as (
    select
      user_id,
      rank() over (order by best_score desc) as world_rank
    from user_best
  )
  select world_rank::integer from ranked where user_id = target_user_id
$function$
;

-- Update leaderboard view to compute composite_score as 10000 - penalty and sort DESC
create or replace view "public"."leaderboard" as  SELECT s.id,
    s.user_id,
    s.puzzle_date,
    s.time_seconds,
    s.moves,
    s.created_at,
    p.display_name,
    p.country_code,
    GREATEST(0, 10000 - (s.time_seconds + (s.moves * 5))) AS composite_score,
    rank() OVER (PARTITION BY s.puzzle_date ORDER BY GREATEST(0, 10000 - (s.time_seconds + (s.moves * 5))) DESC) AS date_rank
   FROM (public.scores s
     JOIN public.profiles p ON ((p.id = s.user_id)))
  WHERE (p.display_name IS NOT NULL);

-- Update world_leaderboard view to map best_score to 10000 - penalty (keep skill rating penalty the same)
CREATE OR REPLACE VIEW public.world_leaderboard AS
WITH globals AS (
    SELECT (COALESCE(avg((scores.time_seconds + (scores.moves * 5))), (0)::numeric))::double precision AS global_avg
    FROM public.scores
), user_stats AS (
    SELECT 
        scores.user_id,
        (avg((scores.time_seconds + (scores.moves * 5))))::double precision AS user_avg,
        max(GREATEST(0, 10000 - (scores.time_seconds + (scores.moves * 5)))) AS best_score,
        count(*) AS total_solved,
        max(scores.created_at) AS last_solve_at
    FROM public.scores
    GROUP BY scores.user_id
), bayesian_ranks AS (
    SELECT 
        us.user_id,
        us.user_avg,
        us.best_score,
        us.total_solved,
        us.last_solve_at,
        (5000.0 / (1.0 + pow(
            ((((us.total_solved)::double precision * us.user_avg) + ((5.0)::double precision * g.global_avg)) / ((us.total_solved)::double precision + (5.0)::double precision)) / 300.0, 
            1.5
        ))) AS skill_rating
    FROM ((user_stats us
    CROSS JOIN globals g)
    JOIN public.profiles p ON ((p.id = us.user_id)))
    WHERE (p.display_name IS NOT NULL)
), ranked_users AS (
    SELECT 
        br.user_id,
        br.best_score,
        br.total_solved,
        br.last_solve_at,
        br.skill_rating,
        rank() OVER (ORDER BY br.skill_rating DESC, br.total_solved DESC, br.last_solve_at) AS global_rank
    FROM bayesian_ranks br
)
SELECT 
    ru.user_id,
    ru.best_score,
    ru.total_solved,
    ru.last_solve_at,
    ru.skill_rating,
    ru.global_rank AS world_rank,
    p.display_name,
    p.country_code,
    p.avatar_url
FROM (ranked_users ru
JOIN public.profiles p ON ((p.id = ru.user_id)))
ORDER BY ru.global_rank;
