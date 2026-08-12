import { currentPope } from "./data/popes.js";

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
