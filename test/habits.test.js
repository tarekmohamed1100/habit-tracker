import { test } from "node:test";
import assert from "node:assert/strict";
import { dayKey, lastDays, currentStreak, toggleDay } from "../src/lib/habits.js";

const today = new Date(2026, 10, 23); // 23 Nov 2026, local time

test("dayKey formats local dates", () => {
  assert.equal(dayKey(today), "2026-11-23");
});

test("lastDays returns n days oldest first, ending today", () => {
  assert.deepEqual(lastDays(3, today), ["2026-11-21", "2026-11-22", "2026-11-23"]);
});

test("streak counts consecutive days up to today", () => {
  const done = ["2026-11-21", "2026-11-22", "2026-11-23"];
  assert.equal(currentStreak(done, today), 3);
});

test("streak keeps counting from yesterday when today is not done yet", () => {
  const done = ["2026-11-21", "2026-11-22"];
  assert.equal(currentStreak(done, today), 2);
});

test("a gap resets the streak", () => {
  const done = ["2026-11-19", "2026-11-21", "2026-11-22", "2026-11-23"];
  assert.equal(currentStreak(done, today), 3);
});

test("toggleDay adds and removes a day", () => {
  let days = toggleDay([], "2026-11-23");
  assert.deepEqual(days, ["2026-11-23"]);
  days = toggleDay(days, "2026-11-23");
  assert.deepEqual(days, []);
});
