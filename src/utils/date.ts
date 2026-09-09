/**
 * Date utility functions
 */

/**
 * Get start of day (00:00:00)
 */
export const getStartOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

/**
 * Get end of day (23:59:59)
 */
export const getEndOfDay = (date: Date): Date => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

/**
 * Get start and end of today
 */
export const getStartAndEndOfToday = (date: Date = new Date()) => {
  return {
    start: getStartOfDay(date),
    end: getEndOfDay(date),
  };
};

/**
 * Get start and end of week
 */
export const getStartAndEndOfWeek = (date: Date = new Date()) => {
  const currentDate = new Date(date);
  const dayOfWeek = currentDate.getDay();
  const diff = currentDate.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);

  const startOfWeek = new Date(currentDate.setDate(diff));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  return {
    start: getStartOfDay(startOfWeek),
    end: getEndOfDay(endOfWeek),
  };
};

/**
 * Format date to string (MM/DD/YYYY)
 */
export const formatDate = (date: Date): string => {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};

/**
 * Format date to ISO string
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};

/**
 * Parse ISO string to date
 */
export const fromISOString = (isoString: string): Date => {
  return new Date(isoString);
};

/**
 * Get days between two dates
 */
export const getDaysBetween = (startDate: Date, endDate: Date): number => {
  const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
  return Math.round(Math.abs((endDate.getTime() - startDate.getTime()) / oneDay));
};

/**
 * Check if two dates are the same day
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Add days to a date
 */
export const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * Subtract days from a date
 */
export const subtractDays = (date: Date, days: number): Date => {
  return addDays(date, -days);
};
