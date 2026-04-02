ALTER TABLE public.profiles 
ADD COLUMN current_streak integer not null default 0,
ADD COLUMN last_solved_date date;
