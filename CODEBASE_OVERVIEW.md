# Patch Extreme - Codebase Overview

Patch Extreme is a sophisticated daily logic puzzle game built with React, TypeScript, and Supabase. Players solve grid-based puzzles by painting contiguous "patches" that match specific shape requirements.

## 🛠 Tech Stack

- **Frontend**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL + GoTrue)
- **State Management**: React Hooks (Custom hooks for game logic and auth)
- **Language**: [TypeScript](https://www.typescriptlang.org/)

## 📁 Project Structure

```text
path-extreme/
├── src/
│   ├── components/     # Reusable UI components (Modals, Grid, TopBar, etc.)
│   ├── engine/         # Core game mechanics (Generator, Solver, Shapes)
│   ├── hooks/          # Custom React hooks (useAuth, useGameState, usePuzzle)
│   ├── lib/            # External service integrations (Supabase, Leaderboard)
│   ├── types/          # Centralized TypeScript interfaces
│   ├── App.tsx         # Main application coordinator
│   └── main.tsx        # Application entry point
├── supabase/           # Database migrations and configuration
└── public/             # Static assets (icons, images)
```

## 🧩 Core Systems

### 1. Puzzle Engine (`src/engine/`)
The engine handles the creation and validation of puzzles:
- **`generator.ts`**: Uses a date-seeded Pseudo-Random Number Generator (PRNG) to create unique daily puzzles. It employs a backtracking algorithm to ensure every puzzle has exactly one valid solution.
- **`solver.ts`**: Provides logic to verify if a set of clues results in a unique solution.
- **`shapes.ts`**: Defines the geometry and orientations of various puzzle pieces (Rectangle, L, T, Z, plus).
- **`difficulty.ts`**: Manages the scaling of puzzle complexity based on the day of the week.

### 2. Game State (`src/hooks/useGameState.ts`)
Manages the active game session, including:
- Painting and clearing shapes on the 8x8 grid.
- History management for the **Undo** functionality.
- Hint system with cooldown management.
- Win detection and score calculation.

### 3. Authentication & Social (`src/hooks/useAuth.ts`, `src/lib/leaderboard.ts`)
- **Auth**: Supports both guest sessions (sessionStorage) and full account registration via Supabase.
- **Profiles**: Users can set display names, country codes (auto-detected), and link social profiles (LinkedIn, GitHub).
- **Leaderboards**: 
  - **Daily Leaderboard**: Ranked by composite score (time + moves) for a specific puzzle.
  - **World Rank**: Global ranking based on skill rating and total puzzles solved.

### 4. Database Schema (`supabase/migrations/`)
The PostgreSQL backend includes tables for:
- `profiles`: User information and social links.
- `scores`: Individual puzzle results.
- `streaks`: Tracking consecutive days played.
- Views/RPCs: Optimized for leaderboard calculations and public profile fetching.

## 🚀 Getting Started

1.  **Install dependencies**: `npm install`
2.  **Setup environment**: Create a `.env.local` file with `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3.  **Run development server**: `npm run dev`
4.  **Database setup**: Use the Supabase CLI (`supabase link`, `supabase db push`) or the Supabase dashboard to apply migrations.

## 🕹 How to Play
1.  **Identify Clues**: Each puzzle starts with anchor cells indicating a shape and size (e.g., 'L 2x3').
2.  **Paint Shapes**: Drag from an anchor cell to cover the required number of tiles.
3.  **Branching**: You can release and drag again from existing painted cells to create complex shapes.
4.  **Solve**: Once a shape matches its intended solution, it locks in place. Fill the entire grid to win!
