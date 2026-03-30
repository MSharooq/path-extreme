import { createClient } from '@supabase/supabase-js';
import { generateDailyPuzzle } from '../src/engine/generator';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// More robust .env.local parser
function loadEnv() {
  const envPath = join(process.cwd(), '.env.local');
  console.log(`Checking for .env file at: ${envPath}`);
  
  if (!existsSync(envPath)) {
    console.error(`File NOT found at ${envPath}`);
    return;
  }

  const content = readFileSync(envPath, 'utf8');
  console.log(`Read ${content.length} bytes from .env.local`);

  const lines = content.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();
      
      // Remove quotes if present
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      process.env[key] = value;
      console.log(`Loaded key: ${key}`);
    }
  }
}

loadEnv();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('\n❌ Error: Missing credentials.');
  console.log('Available keys in process.env:', Object.keys(process.env).filter(k => k.includes('SUPABASE') || k.includes('VITE')));
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function generateAndUpload() {
  const startDate = new Date();
  const daysToGenerate = 365;

  console.log(`🚀 Starting generation for ${daysToGenerate} days...`);

  for (let i = 0; i < daysToGenerate; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);
    const dateStr = currentDate.toISOString().split('T')[0];

    try {
      const puzzle = generateDailyPuzzle(dateStr);

      const { error: pError } = await supabase
        .from('puzzles')
        .upsert({
          date: dateStr,
          day_of_week: puzzle.dayOfWeek,
          pieces: puzzle.pieces,
        });

      if (pError) throw new Error(`Puzzles table error: ${pError.message}`);

      const { error: sError } = await supabase
        .from('puzzle_solutions')
        .upsert({
          date: dateStr,
          solution: puzzle.solution,
          piece_cells: {},
        });

      if (sError) throw new Error(`Solutions table error: ${sError.message}`);

      process.stdout.write(`✅ [${i + 1}/${daysToGenerate}] ${dateStr}\r`);

    } catch (err) {
      console.error(`\n❌ [${i + 1}/${daysToGenerate}] ${dateStr}: Failed -`, err);
    }
  }

  console.log('\n✨ Generation completed!');
}

generateAndUpload();
