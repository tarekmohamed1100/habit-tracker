# Habit Tracker

Track daily habits on a 14-day grid, with a streak count for each. A streak keeps counting from yesterday until you mark today, so it doesn't reset mid-day. Data is saved in `localStorage`.

## Run it

```bash
npm install
npm run dev
```

## Test and build

```bash
npm test
npm run build
```

Streak and date logic live in `src/lib/habits.js` and are covered by `node --test`.
