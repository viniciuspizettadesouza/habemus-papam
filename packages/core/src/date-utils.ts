import type { DateInput, PontificateDuration } from "./types.js";

const MILLISECONDS_PER_DAY = 86_400_000;

interface DateParts {
  year: number;
  month: number;
  day: number;
}

export function toIsoDate(value: DateInput): string {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new TypeError("Expected a valid Date or ISO date string.");
    }

    const calendarYear = value.getFullYear();

    if (calendarYear < 0 || calendarYear > 9999) {
      throw new TypeError("Expected a date with a four-digit calendar year.");
    }

    const year = String(calendarYear).padStart(4, "0");
    const month = String(value.getMonth() + 1).padStart(2, "0");
    const day = String(value.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    Number.isNaN(Date.parse(`${value}T00:00:00Z`)) ||
    new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) !== value
  ) {
    throw new TypeError("Expected a valid Date or ISO date string.");
  }

  return value;
}

export function getDateParts(isoDate: string): DateParts {
  const [year, month, day] = isoDate.split("-").map(Number);
  return { year, month, day };
}

export function formatDateParts({ year, month, day }: DateParts): string {
  return [year, month, day]
    .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, "0"))
    .join("-");
}

function utcTimestamp({ year, month, day }: DateParts): number {
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  return date.getTime();
}

export function daysBetween(start: string, end: string): number {
  const startParts = getDateParts(start);
  const endParts = getDateParts(end);
  const startTime = utcTimestamp(startParts);
  const endTime = utcTimestamp(endParts);

  return Math.round((endTime - startTime) / MILLISECONDS_PER_DAY);
}

export function daysInMonth(year: number, month: number): number {
  return new Date(
    utcTimestamp({ year, month: month + 1, day: 0 }),
  ).getUTCDate();
}

function addYears(date: DateParts, years: number): DateParts {
  const year = date.year + years;
  return {
    year,
    month: date.month,
    day: Math.min(date.day, daysInMonth(year, date.month)),
  };
}

function addMonths(date: DateParts, months: number): DateParts {
  const monthIndex = date.year * 12 + date.month - 1 + months;
  const year = Math.floor(monthIndex / 12);
  const month = (monthIndex % 12) + 1;

  return {
    year,
    month,
    day: Math.min(date.day, daysInMonth(year, month)),
  };
}

export function calendarDifference(
  start: string,
  end: string,
): PontificateDuration {
  const startParts = getDateParts(start);
  const endParts = getDateParts(end);
  let years = endParts.year - startParts.year;
  let yearAnchor = addYears(startParts, years);

  if (formatDateParts(yearAnchor) > end) {
    years -= 1;
    yearAnchor = addYears(startParts, years);
  }

  let months =
    (endParts.year - yearAnchor.year) * 12 + endParts.month - yearAnchor.month;
  let monthAnchor = addMonths(yearAnchor, months);

  if (formatDateParts(monthAnchor) > end) {
    months -= 1;
    monthAnchor = addMonths(yearAnchor, months);
  }

  return {
    years,
    months,
    days: daysBetween(formatDateParts(monthAnchor), end),
    totalDays: daysBetween(start, end),
  };
}
