import { currentPope } from "./data/popes.js";
import {
  calendarDifference,
  daysBetween,
  formatDateParts,
  getDateParts,
  toIsoDate,
} from "./date-utils.js";
import type {
  DateInput,
  PopeAgeInput,
  PontificateDuration,
  PontificateInput,
} from "./types.js";

const [ELECTION_YEAR, ELECTION_MONTH, ELECTION_DAY] = currentPope.elected
  .split("-")
  .map(Number);

function validateDate(date: Date): void {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError("Expected a valid Date instance.");
  }
}

export function isElectionDay(date: Date = new Date()): boolean {
  validateDate(date);

  return (
    date.getFullYear() === ELECTION_YEAR &&
    date.getMonth() === ELECTION_MONTH - 1 &&
    date.getDate() === ELECTION_DAY
  );
}

export function isElectionAnniversary(date: Date = new Date()): boolean {
  validateDate(date);

  return (
    date.getFullYear() >= ELECTION_YEAR &&
    date.getMonth() === ELECTION_MONTH - 1 &&
    date.getDate() === ELECTION_DAY
  );
}

/** @deprecated Use isElectionDay() instead. */
export function isElectionDayToday(): boolean {
  return isElectionDay();
}

function validatePope(pope: unknown): asserts pope is PontificateInput {
  const record = pope as Partial<PontificateInput> | null;

  if (
    record === null ||
    typeof record !== "object" ||
    typeof record.elected !== "string" ||
    (record.pontificateEnd !== null &&
      typeof record.pontificateEnd !== "string")
  ) {
    throw new TypeError("Expected a pope record.");
  }

  toIsoDate(record.elected);

  if (record.pontificateEnd !== null) {
    toIsoDate(record.pontificateEnd);

    if (record.pontificateEnd < record.elected) {
      throw new RangeError("The pontificate ends before the pope's election.");
    }
  }
}

export function getPontificateDuration(
  pope: Readonly<PontificateInput> = currentPope,
  date: DateInput = new Date(),
): PontificateDuration {
  validatePope(pope);
  const referenceDate = toIsoDate(date);

  if (referenceDate < pope.elected) {
    throw new RangeError("The reference date is before the pope's election.");
  }

  const endDate =
    pope.pontificateEnd !== null && pope.pontificateEnd < referenceDate
      ? pope.pontificateEnd
      : referenceDate;

  return calendarDifference(pope.elected, endDate);
}

export function getPopeAge(
  pope: Readonly<PopeAgeInput> = currentPope,
  date: DateInput = new Date(),
): number {
  validatePope(pope);

  if (typeof pope.birthDate !== "string") {
    throw new TypeError("Expected a pope record with a birth date.");
  }

  const birthDate = toIsoDate(pope.birthDate);
  const referenceDate = toIsoDate(date);

  if (referenceDate < birthDate) {
    throw new RangeError("The reference date is before the pope's birth.");
  }

  return calendarDifference(birthDate, referenceDate).years;
}

export function getNextElectionAnniversary(
  pope: Readonly<PontificateInput> = currentPope,
  date: DateInput = new Date(),
): string {
  validatePope(pope);
  const referenceDate = toIsoDate(date);
  const election = getDateParts(pope.elected);
  const reference = getDateParts(referenceDate);
  let year = Math.max(election.year, reference.year);
  let anniversary = formatDateParts({
    year,
    month: election.month,
    day: election.day,
  });

  if (anniversary <= referenceDate) {
    year += 1;
    anniversary = formatDateParts({
      year,
      month: election.month,
      day: election.day,
    });
  }

  return anniversary;
}

export function daysSinceElection(
  pope: Readonly<PontificateInput> = currentPope,
  date: DateInput = new Date(),
): number {
  validatePope(pope);
  const referenceDate = toIsoDate(date);
  const elapsedDays = daysBetween(pope.elected, referenceDate);

  if (elapsedDays < 0) {
    throw new RangeError("The reference date is before the pope's election.");
  }

  return elapsedDays;
}
