/**
 * Date boundaries.
 *
 * Every diary query is bounded by a day or a week, so an off-by-one here would
 * silently drop the first or last meal of a day. The edges are asserted
 * explicitly, including across month and year boundaries.
 */

import {
  addDays,
  getDaysBetween,
  getEndOfDay,
  getStartAndEndOfToday,
  getStartAndEndOfWeek,
  getStartOfDay,
  isSameDay,
  subtractDays,
} from '../date';

describe('day boundaries', () => {
  it('starts a day at midnight and ends it a millisecond before the next', () => {
    const date = new Date('2026-03-15T13:45:30.500Z');
    const start = getStartOfDay(date);
    const end = getEndOfDay(date);

    expect(start.getHours()).toBe(0);
    expect(start.getMinutes()).toBe(0);
    expect(start.getSeconds()).toBe(0);
    expect(start.getMilliseconds()).toBe(0);

    expect(end.getHours()).toBe(23);
    expect(end.getMinutes()).toBe(59);
    expect(end.getSeconds()).toBe(59);
    expect(end.getMilliseconds()).toBe(999);
  });

  it('leaves the date it was given untouched', () => {
    const date = new Date('2026-03-15T13:45:30.500Z');
    const before = date.getTime();

    getStartOfDay(date);
    getEndOfDay(date);

    expect(date.getTime()).toBe(before);
  });

  it('brackets the whole day, and nothing outside it', () => {
    const date = new Date(2026, 2, 15, 12);
    const { start, end } = getStartAndEndOfToday(date);

    expect(start.getDate()).toBe(15);
    expect(end.getDate()).toBe(15);
    expect(end.getTime() - start.getTime()).toBe(24 * 60 * 60 * 1000 - 1);
  });
});

describe('week boundaries', () => {
  it('spans seven whole days', () => {
    const { start, end } = getStartAndEndOfWeek(new Date(2026, 2, 18));
    const days = (end.getTime() - start.getTime() + 1) / (24 * 60 * 60 * 1000);

    expect(days).toBe(7);
    expect(start.getHours()).toBe(0);
    expect(end.getHours()).toBe(23);
  });
});

describe('arithmetic', () => {
  it('adds and subtracts days across a month boundary', () => {
    const endOfMonth = new Date(2026, 0, 31, 12);

    expect(addDays(endOfMonth, 1).getMonth()).toBe(1);
    expect(addDays(endOfMonth, 1).getDate()).toBe(1);
    expect(subtractDays(new Date(2026, 1, 1, 12), 1).getDate()).toBe(31);
  });

  it('crosses a year boundary', () => {
    const newYearsEve = new Date(2025, 11, 31, 12);
    const next = addDays(newYearsEve, 1);

    expect(next.getFullYear()).toBe(2026);
    expect(next.getMonth()).toBe(0);
    expect(next.getDate()).toBe(1);
  });

  it('does not mutate its argument', () => {
    const date = new Date(2026, 2, 15, 12);
    const before = date.getTime();

    addDays(date, 5);
    subtractDays(date, 5);

    expect(date.getTime()).toBe(before);
  });

  it('counts the days between two dates', () => {
    expect(getDaysBetween(new Date(2026, 2, 1), new Date(2026, 2, 8))).toBe(7);
    expect(getDaysBetween(new Date(2026, 2, 1), new Date(2026, 2, 1))).toBe(0);
  });
});

describe('isSameDay', () => {
  it('ignores the time of day', () => {
    expect(
      isSameDay(new Date(2026, 2, 15, 0, 0), new Date(2026, 2, 15, 23, 59))
    ).toBe(true);
  });

  it('separates adjacent days', () => {
    expect(
      isSameDay(new Date(2026, 2, 15, 23, 59), new Date(2026, 2, 16, 0, 0))
    ).toBe(false);
  });

  it('separates the same day in different years', () => {
    expect(isSameDay(new Date(2025, 2, 15), new Date(2026, 2, 15))).toBe(false);
  });
});
