CREATE OR REPLACE FUNCTION get_today_puzzle()
RETURNS SETOF puzzles
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM puzzles 
  WHERE date = (now() AT TIME ZONE 'UTC')::date;
$$;

-- Grant access to anon and authenticated roles
GRANT EXECUTE ON FUNCTION get_today_puzzle() TO anon, authenticated;
