// Dates are local calendar days, written as "YYYY-MM-DD".
export function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// The last n days, oldest first, ending at `base`.
export function lastDays(n, base = new Date()) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date(base.getFullYear(), base.getMonth(), base.getDate() - (n - 1 - i));
    return dayKey(d);
  });
}

// Consecutive done days ending today. If today is not done yet,
// the streak still counts from yesterday, so it doesn't reset mid-day.
export function currentStreak(doneDays, today = new Date()) {
  const done = new Set(doneDays);
  let cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  if (!done.has(dayKey(cursor))) cursor.setDate(cursor.getDate() - 1);

  let streak = 0;
  while (done.has(dayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function toggleDay(doneDays, key) {
  return doneDays.includes(key) ? doneDays.filter((d) => d !== key) : [...doneDays, key];
}
