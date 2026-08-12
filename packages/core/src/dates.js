import { currentPope } from "./data/popes.js";
import {
  calendarDifference,
  daysBetween,
  formatDateParts,
  getDateParts,
  toIsoDate,
} from "./date-utils.js";

const [ELECTION_YEAR, ELECTION_MONTH, ELECTION_DAY] = currentPope.elected
  .split("-")
  .map(Number);

function validateDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError("Expected a valid Date instance.");
  }
}

export function isElectionDay(date = new Date()) {
  validateDate(date);

  return (
    date.getFullYear() === ELECTION_YEAR &&
    date.getMonth() === ELECTION_MONTH - 1 &&
    date.getDate() === ELECTION_DAY
  );
}

export function isElectionAnniversary(date = new Date()) {
  validateDate(date);

  return (
    date.getFullYear() >= ELECTION_YEAR &&
    date.getMonth() === ELECTION_MONTH - 1 &&
    date.getDate() === ELECTION_DAY
  );
}

/** @deprecated Use isElectionDay() instead. */
export function isElectionDayToday() {
  return isElectionDay();
}

function validatePope(pope) {
  if (
    pope === null ||
    typeof pope !== "object" ||
    typeof pope.elected !== "string"
  ) {
    throw new TypeError("Expected a pope record.");
  }

  toIsoDate(pope.elected);

  if (pope.pontificateEnd !== null) {
    toIsoDate(pope.pontificateEnd);

    if (pope.pontificateEnd < pope.elected) {
      throw new RangeError("The pontificate ends before the pope's election.");
    }
  }
}

export function getPontificateDuration(pope = currentPope, date = new Date()) {
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

export function getPopeAge(pope = currentPope, date = new Date()) {
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
  pope = currentPope,
  date = new Date(),
) {
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

export function daysSinceElection(pope = currentPope, date = new Date()) {
  validatePope(pope);
  const referenceDate = toIsoDate(date);
  const elapsedDays = daysBetween(pope.elected, referenceDate);

  if (elapsedDays < 0) {
    throw new RangeError("The reference date is before the pope's election.");
  }

  return elapsedDays;
}
