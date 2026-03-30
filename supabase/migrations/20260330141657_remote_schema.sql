drop extension if exists "pg_net";


  create table "public"."profiles" (
    "id" uuid not null,
    "display_name" text,
    "updated_at" timestamp with time zone not null default timezone('utc'::text, now()),
    "country_code" text,
    "linkedin_url" text,
    "github_url" text,
    "portfolio_url" text,
    "avatar_url" text
      );


alter table "public"."profiles" enable row level security;


  create table "public"."puzzle_sessions" (
    "user_id" uuid not null,
    "puzzle_date" date not null,
    "started_at" timestamp with time zone not null default now()
      );


alter table "public"."puzzle_sessions" enable row level security;


  create table "public"."puzzle_solutions" (
    "date" date not null,
    "solution" jsonb not null,
    "piece_cells" jsonb not null default '{}'::jsonb
      );


alter table "public"."puzzle_solutions" enable row level security;


  create table "public"."puzzles" (
    "date" date not null,
    "day_of_week" smallint not null,
    "pieces" jsonb not null,
    "generated_at" timestamp with time zone not null default now()
      );


alter table "public"."puzzles" enable row level security;


  create table "public"."scores" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "puzzle_date" date not null,
    "time_seconds" integer not null,
    "moves" integer not null default 0,
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
      );


alter table "public"."scores" enable row level security;

CREATE UNIQUE INDEX profiles_display_name_key ON public.profiles USING btree (display_name);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX puzzle_sessions_pkey ON public.puzzle_sessions USING btree (user_id, puzzle_date);

CREATE UNIQUE INDEX puzzle_solutions_pkey ON public.puzzle_solutions USING btree (date);

CREATE UNIQUE INDEX puzzles_pkey ON public.puzzles USING btree (date);

CREATE UNIQUE INDEX scores_pkey ON public.scores USING btree (id);

CREATE UNIQUE INDEX scores_user_id_puzzle_date_key ON public.scores USING btree (user_id, puzzle_date);

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."puzzle_sessions" add constraint "puzzle_sessions_pkey" PRIMARY KEY using index "puzzle_sessions_pkey";

alter table "public"."puzzle_solutions" add constraint "puzzle_solutions_pkey" PRIMARY KEY using index "puzzle_solutions_pkey";

alter table "public"."puzzles" add constraint "puzzles_pkey" PRIMARY KEY using index "puzzles_pkey";

alter table "public"."scores" add constraint "scores_pkey" PRIMARY KEY using index "scores_pkey";

alter table "public"."profiles" add constraint "display_name_length" CHECK (((char_length(display_name) >= 3) AND (char_length(display_name) <= 20))) not valid;

alter table "public"."profiles" validate constraint "display_name_length";

alter table "public"."profiles" add constraint "profiles_display_name_key" UNIQUE using index "profiles_display_name_key";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."puzzle_sessions" add constraint "puzzle_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."puzzle_sessions" validate constraint "puzzle_sessions_user_id_fkey";

alter table "public"."puzzle_solutions" add constraint "puzzle_solutions_date_fkey" FOREIGN KEY (date) REFERENCES public.puzzles(date) ON DELETE CASCADE not valid;

alter table "public"."puzzle_solutions" validate constraint "puzzle_solutions_date_fkey";

alter table "public"."puzzles" add constraint "puzzles_day_of_week_check" CHECK (((day_of_week >= 0) AND (day_of_week <= 6))) not valid;

alter table "public"."puzzles" validate constraint "puzzles_day_of_week_check";

alter table "public"."scores" add constraint "scores_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."scores" validate constraint "scores_user_id_fkey";

alter table "public"."scores" add constraint "scores_user_id_puzzle_date_key" UNIQUE using index "scores_user_id_puzzle_date_key";

set check_function_bodies = off;

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
    min(s.time_seconds + s.moves * 5) as best_score,
    p.updated_at
  from profiles p
  left join scores s on s.user_id = p.id
  where p.id = target_user_id
  group by p.id, p.display_name, p.country_code, p.linkedin_url, p.github_url, p.portfolio_url, p.avatar_url, p.updated_at
$function$
;

CREATE OR REPLACE FUNCTION public.get_user_world_rank(target_user_id uuid)
 RETURNS integer
 LANGUAGE sql
 STABLE
AS $function$
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
$function$
;

create or replace view "public"."leaderboard" as  SELECT s.id,
    s.user_id,
    s.puzzle_date,
    s.time_seconds,
    s.moves,
    s.created_at,
    p.display_name,
    p.country_code,
    (s.time_seconds + (s.moves * 5)) AS composite_score,
    rank() OVER (PARTITION BY s.puzzle_date ORDER BY (s.time_seconds + (s.moves * 5))) AS date_rank
   FROM (public.scores s
     JOIN public.profiles p ON ((p.id = s.user_id)))
  WHERE (p.display_name IS NOT NULL);


create or replace view "public"."world_leaderboard" as  WITH globals AS (
         SELECT (COALESCE(avg((scores.time_seconds + (scores.moves * 5))), (0)::numeric))::double precision AS global_avg
           FROM public.scores
        ), user_stats AS (
         SELECT scores.user_id,
            (avg((scores.time_seconds + (scores.moves * 5))))::double precision AS user_avg,
            min((scores.time_seconds + (scores.moves * 5))) AS best_score,
            count(*) AS total_solved,
            max(scores.created_at) AS last_solve_at
           FROM public.scores
          GROUP BY scores.user_id
        ), bayesian_ranks AS (
         SELECT us.user_id,
            us.user_avg,
            us.best_score,
            us.total_solved,
            us.last_solve_at,
            ((((us.total_solved)::double precision * us.user_avg) + ((5.0)::double precision * g.global_avg)) / ((us.total_solved)::double precision + (5.0)::double precision)) AS skill_rating
           FROM ((user_stats us
             CROSS JOIN globals g)
             JOIN public.profiles p_1 ON ((p_1.id = us.user_id)))
          WHERE (p_1.display_name IS NOT NULL)
        ), ranked_users AS (
         SELECT br.user_id,
            br.user_avg,
            br.best_score,
            br.total_solved,
            br.last_solve_at,
            br.skill_rating,
            rank() OVER (ORDER BY br.skill_rating, br.total_solved DESC, br.last_solve_at) AS global_rank
           FROM bayesian_ranks br
        )
 SELECT ru.user_id,
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


grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."puzzle_sessions" to "anon";

grant insert on table "public"."puzzle_sessions" to "anon";

grant references on table "public"."puzzle_sessions" to "anon";

grant select on table "public"."puzzle_sessions" to "anon";

grant trigger on table "public"."puzzle_sessions" to "anon";

grant truncate on table "public"."puzzle_sessions" to "anon";

grant update on table "public"."puzzle_sessions" to "anon";

grant delete on table "public"."puzzle_sessions" to "authenticated";

grant insert on table "public"."puzzle_sessions" to "authenticated";

grant references on table "public"."puzzle_sessions" to "authenticated";

grant select on table "public"."puzzle_sessions" to "authenticated";

grant trigger on table "public"."puzzle_sessions" to "authenticated";

grant truncate on table "public"."puzzle_sessions" to "authenticated";

grant update on table "public"."puzzle_sessions" to "authenticated";

grant delete on table "public"."puzzle_sessions" to "service_role";

grant insert on table "public"."puzzle_sessions" to "service_role";

grant references on table "public"."puzzle_sessions" to "service_role";

grant select on table "public"."puzzle_sessions" to "service_role";

grant trigger on table "public"."puzzle_sessions" to "service_role";

grant truncate on table "public"."puzzle_sessions" to "service_role";

grant update on table "public"."puzzle_sessions" to "service_role";

grant delete on table "public"."puzzle_solutions" to "anon";

grant insert on table "public"."puzzle_solutions" to "anon";

grant references on table "public"."puzzle_solutions" to "anon";

grant select on table "public"."puzzle_solutions" to "anon";

grant trigger on table "public"."puzzle_solutions" to "anon";

grant truncate on table "public"."puzzle_solutions" to "anon";

grant update on table "public"."puzzle_solutions" to "anon";

grant delete on table "public"."puzzle_solutions" to "authenticated";

grant insert on table "public"."puzzle_solutions" to "authenticated";

grant references on table "public"."puzzle_solutions" to "authenticated";

grant select on table "public"."puzzle_solutions" to "authenticated";

grant trigger on table "public"."puzzle_solutions" to "authenticated";

grant truncate on table "public"."puzzle_solutions" to "authenticated";

grant update on table "public"."puzzle_solutions" to "authenticated";

grant delete on table "public"."puzzle_solutions" to "service_role";

grant insert on table "public"."puzzle_solutions" to "service_role";

grant references on table "public"."puzzle_solutions" to "service_role";

grant select on table "public"."puzzle_solutions" to "service_role";

grant trigger on table "public"."puzzle_solutions" to "service_role";

grant truncate on table "public"."puzzle_solutions" to "service_role";

grant update on table "public"."puzzle_solutions" to "service_role";

grant delete on table "public"."puzzles" to "anon";

grant insert on table "public"."puzzles" to "anon";

grant references on table "public"."puzzles" to "anon";

grant select on table "public"."puzzles" to "anon";

grant trigger on table "public"."puzzles" to "anon";

grant truncate on table "public"."puzzles" to "anon";

grant update on table "public"."puzzles" to "anon";

grant delete on table "public"."puzzles" to "authenticated";

grant insert on table "public"."puzzles" to "authenticated";

grant references on table "public"."puzzles" to "authenticated";

grant select on table "public"."puzzles" to "authenticated";

grant trigger on table "public"."puzzles" to "authenticated";

grant truncate on table "public"."puzzles" to "authenticated";

grant update on table "public"."puzzles" to "authenticated";

grant delete on table "public"."puzzles" to "service_role";

grant insert on table "public"."puzzles" to "service_role";

grant references on table "public"."puzzles" to "service_role";

grant select on table "public"."puzzles" to "service_role";

grant trigger on table "public"."puzzles" to "service_role";

grant truncate on table "public"."puzzles" to "service_role";

grant update on table "public"."puzzles" to "service_role";

grant delete on table "public"."scores" to "anon";

grant insert on table "public"."scores" to "anon";

grant references on table "public"."scores" to "anon";

grant select on table "public"."scores" to "anon";

grant trigger on table "public"."scores" to "anon";

grant truncate on table "public"."scores" to "anon";

grant update on table "public"."scores" to "anon";

grant delete on table "public"."scores" to "authenticated";

grant insert on table "public"."scores" to "authenticated";

grant references on table "public"."scores" to "authenticated";

grant select on table "public"."scores" to "authenticated";

grant trigger on table "public"."scores" to "authenticated";

grant truncate on table "public"."scores" to "authenticated";

grant update on table "public"."scores" to "authenticated";

grant delete on table "public"."scores" to "service_role";

grant insert on table "public"."scores" to "service_role";

grant references on table "public"."scores" to "service_role";

grant select on table "public"."scores" to "service_role";

grant trigger on table "public"."scores" to "service_role";

grant truncate on table "public"."scores" to "service_role";

grant update on table "public"."scores" to "service_role";


  create policy "Public profiles are viewable by everyone."
  on "public"."profiles"
  as permissive
  for select
  to public
using (true);



  create policy "Users can insert their own profile."
  on "public"."profiles"
  as permissive
  for insert
  to public
with check ((auth.uid() = id));



  create policy "Users can update own profile."
  on "public"."profiles"
  as permissive
  for update
  to public
using ((auth.uid() = id));



  create policy "Users manage own sessions"
  on "public"."puzzle_sessions"
  as permissive
  for all
  to authenticated
using ((user_id = auth.uid()))
with check ((user_id = auth.uid()));



  create policy "Read today and past puzzles"
  on "public"."puzzles"
  as permissive
  for select
  to anon, authenticated
using ((date <= ((now() AT TIME ZONE 'UTC'::text))::date));



  create policy "Authenticated users can insert their own score."
  on "public"."scores"
  as permissive
  for insert
  to public
with check ((auth.uid() = user_id));



  create policy "Scores are viewable by everyone."
  on "public"."scores"
  as permissive
  for select
  to public
using (true);



