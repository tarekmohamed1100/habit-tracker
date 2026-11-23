import { useEffect, useId, useMemo, useState } from "react";
import { currentStreak, dayKey, lastDays, toggleDay } from "./lib/habits.js";

const KEY = "habit-tracker-v1";
const WINDOW = 14;

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

function HabitRow({ habit, days, onToggle, onDelete }) {
  const streak = currentStreak(habit.done);
  return (
    <li className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="font-medium">{habit.name}</p>
          <p className="text-xs text-teal-700">{streak} day streak</p>
        </div>
        <button onClick={onDelete} className="text-xs text-rose-600 hover:underline">Delete</button>
      </div>
      <div className="mt-3 grid grid-cols-7 gap-1.5 sm:grid-cols-[repeat(14,minmax(0,1fr))]">
        {days.map((day) => {
          const on = habit.done.includes(day);
          return (
            <button
              key={day}
              onClick={() => onToggle(day)}
              aria-pressed={on}
              aria-label={`${habit.name} on ${day}`}
              title={day}
              className={`h-7 rounded-md border text-[10px] transition-transform active:scale-95 ${
                on ? "border-teal-600 bg-teal-500 text-white" : "border-stone-200 bg-stone-50 text-stone-400 hover:border-teal-400"
              }`}
            >
              {Number(day.slice(8))}
            </button>
          );
        })}
      </div>
    </li>
  );
}

export default function App() {
  const [habits, setHabits] = useState(load);
  const [name, setName] = useState("");
  const inputId = useId();
  const days = useMemo(() => lastDays(WINDOW), []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(habits));
  }, [habits]);

  const update = (id, fn) => setHabits((hs) => hs.map((h) => (h.id === id ? { ...h, done: fn(h.done) } : h)));

  const add = (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    setHabits((hs) => [...hs, { id: crypto.randomUUID(), name: trimmed, done: [] }]);
    setName("");
  };

  return (
    <main className="min-h-screen bg-stone-100 p-6 text-stone-800">
      <div className="mx-auto max-w-2xl space-y-6">
        <header>
          <h1 className="text-2xl font-bold">Habit tracker</h1>
          <p className="text-sm text-stone-500">Today is {dayKey()}. Tap a day to mark it done.</p>
        </header>

        <form onSubmit={add} className="flex gap-2">
          <label htmlFor={inputId} className="sr-only">New habit</label>
          <input
            id={inputId}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="e.g. Read 20 pages"
            className="min-w-0 flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
          <button className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">Add habit</button>
        </form>

        {habits.length === 0 ? (
          <p className="rounded-xl border border-dashed border-stone-300 p-8 text-center text-sm text-stone-500">
            No habits yet. Add one above to start your streak.
          </p>
        ) : (
          <ul className="space-y-3">
            {habits.map((h) => (
              <HabitRow
                key={h.id}
                habit={h}
                days={days}
                onToggle={(day) => update(h.id, (done) => toggleDay(done, day))}
                onDelete={() => setHabits((hs) => hs.filter((x) => x.id !== h.id))}
              />
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
