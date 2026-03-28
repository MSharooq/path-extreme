-- Disable score updates to enforce "First Solve Counts" policy
-- Users can only insert a score for a specific puzzle date once.

drop policy if exists "Users can update their own score." on scores;
