const MILLISECONDS_PER_DAY = 86_400_000;

export function toIsoDate(value) {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new TypeError("Expected a valid Date or ISO date string.");
    }

    const year = String(value.getFullYear()).padStart(4, "0");
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

export function getDateParts(isoDate) {
  const [year, month, day] = isoDate.split("-").map(Number);
  return { year, month, day };
}

export function formatDateParts({ year, month, day }) {
  return [year, month, day]
    .map((part, index) => String(part).padStart(index === 0 ? 4 : 2, "0"))
    .join("-");
}

export function daysBetween(start, end) {
  const startParts = getDateParts(start);
  const endParts = getDateParts(end);
  const startTime = Date.UTC(
    startParts.year,
    startParts.month - 1,
    startParts.day,
  );
  const endTime = Date.UTC(endParts.year, endParts.month - 1, endParts.day);

  return Math.round((endTime - startTime) / MILLISECONDS_PER_DAY);
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month, 0)).getUTCDate();
}

function addYears(date, years) {
  const year = date.year + years;
  return {
    year,
    month: date.month,
    day: Math.min(date.day, daysInMonth(year, date.month)),
  };
}

function addMonths(date, months) {
  const monthIndex = date.year * 12 + date.month - 1 + months;
  const year = Math.floor(monthIndex / 12);
  const month = (monthIndex % 12) + 1;

  return {
    year,
    month,
    day: Math.min(date.day, daysInMonth(year, month)),
  };
}

export function calendarDifference(start, end) {
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
