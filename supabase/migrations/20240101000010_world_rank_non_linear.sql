-- Update world_leaderboard view with non-linear Elo-inspired rating
DROP VIEW IF EXISTS public.world_leaderboard;

CREATE OR REPLACE VIEW public.world_leaderboard AS
WITH globals AS (
    SELECT (COALESCE(avg((scores.time_seconds + (scores.moves * 5))), (0)::numeric))::double precision AS global_avg
    FROM public.scores
), user_stats AS (
    SELECT 
        scores.user_id,
        (avg((scores.time_seconds + (scores.moves * 5))))::double precision AS user_avg,
        min((scores.time_seconds + (scores.moves * 5))) AS best_score,
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
        -- Non-linear Elo-like rating: 5000 / (1 + (weighted_avg / 300)^1.5)
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
