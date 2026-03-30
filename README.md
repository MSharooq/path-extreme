# Patch Extreme

**Patch Extreme** is a daily logic puzzle game where players paint contiguous shapes on an 8x8 grid based on anchor clues. Built with React 19, TypeScript, Tailwind CSS 4, and Supabase.

## 📄 Documentation

For a detailed look at the project's architecture, core systems, and technical stack, please refer to the:

👉 **[Codebase Overview (CODEBASE_OVERVIEW.md)](./CODEBASE_OVERVIEW.md)**

## 🚀 Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment**:
   Create a `.env.local` file with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🛠 Features

- **Daily Puzzles**: Unique challenges generated every day via date-seeded PRNG.
- **Backtracking Solver**: Ensures every puzzle has a single unique solution.
- **Global Leaderboards**: Compare your scores (time + moves) with players worldwide.
- **Account Progress**: Track your streaks and customize your public profile.
- **Mobile Responsive**: Fully optimized for a premium puzzle experience on all devices.

