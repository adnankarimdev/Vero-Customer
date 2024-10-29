import { parseISO, addDays, isAfter } from "date-fns";

export function isThreeDaysPassed(timestamp: string): boolean {
  const givenDate = parseISO(timestamp);
  const targetDate = addDays(givenDate, 3);
  const currentDate = new Date();

  return isAfter(currentDate, targetDate);
}
