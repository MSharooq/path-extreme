-- Grant access to the world_leaderboard view for public and authenticated users
GRANT SELECT ON public.world_leaderboard TO anon;
GRANT SELECT ON public.world_leaderboard TO authenticated;

-- Force a schema reload for PostgREST
NOTIFY pgrst, 'reload schema';
