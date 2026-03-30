import { createClient } from '@supabase/supabase-js';
import { generateDailyPuzzle } from './engine/generator';
import { Command } from 'commander';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

// Load .env.local from the root directory
const rootEnvPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config(); // Fallback to current dir .env
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: VITE_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const program = new Command();

program
  .name('puzzle-generator')
  .description('Standalone tool to pre-generate puzzles for PatchExtreme')
  .version('1.0.0')
  .option('-d, --days <number>', 'Number of days to generate puzzles for', '30')
  .option('-s, --start <date>', 'Start date (YYYY-MM-DD)', new Date().toISOString().split('T')[0])
  .action(async (options) => {
    const days = parseInt(options.days);
    const startDate = new Date(options.start);

    console.log(`🚀 Starting puzzle generation for ${days} days...`);
    console.log(`📅 Start date: ${startDate.toISOString().split('T')[0]}`);

    for (let i = 0; i < days; i++) {
      const current = new Date(startDate);
      current.setDate(startDate.getDate() + i);
      const dateStr = current.toISOString().split('T')[0];

      try {
        console.log(`🧩 Generating puzzle for ${dateStr}...`);
        const puzzle = generateDailyPuzzle(dateStr);

        // 1. Insert/Upsert Puzzle
        const { error: puzzleError } = await supabase
          .from('puzzles')
          .upsert({
            date: dateStr,
            day_of_week: puzzle.dayOfWeek,
            pieces: puzzle.pieces
          }, { onConflict: 'date' });

        if (puzzleError) throw puzzleError;

        // 2. Insert/Upsert Solution
        const { error: solutionError } = await supabase
          .from('puzzle_solutions')
          .upsert({
            date: dateStr,
            solution: puzzle.solution
          }, { onConflict: 'date' });

        if (solutionError) throw solutionError;

        console.log(`✅ Successfully uploaded puzzle and solution for ${dateStr}`);
      } catch (err: any) {
        console.error(`❌ Error generating/uploading for ${dateStr}:`, err.message);
      }
    }

    console.log('🎉 Generation complete!');
  });

program.parse(process.argv);
