const ELECTION_YEAR = 2025;
const ELECTION_MONTH = 4;
const ELECTION_DAY = 8;

function validateDate(date) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError("Expected a valid Date instance.");
  }
}

export function isElectionDay(date = new Date()) {
  validateDate(date);

  return (
    date.getFullYear() === ELECTION_YEAR &&
    date.getMonth() === ELECTION_MONTH &&
    date.getDate() === ELECTION_DAY
  );
}

export function isElectionAnniversary(date = new Date()) {
  validateDate(date);

  return (
    date.getFullYear() >= ELECTION_YEAR &&
    date.getMonth() === ELECTION_MONTH &&
    date.getDate() === ELECTION_DAY
  );
}

/** @deprecated Use isElectionDay() instead. */
export function isElectionDayToday() {
  return isElectionDay();
}

export function getCurrentPope() {
  return {
    name: "Pope Leo XIV",
    birthName: "Robert Francis Prevost",
    elected: "2025-05-08",
  };
}
