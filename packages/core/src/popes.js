import { currentPope, popes } from "./data/popes.js";

function clonePope(pope) {
  return pope ? { ...pope } : null;
}

function normalizeName(value) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new TypeError("Expected a non-empty pope name.");
  }

  return value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[łŁ]/g, "l")
    .toLowerCase()
    .replace(/^pope\s+/, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function toIsoDate(value) {
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

export function getCurrentPope() {
  return clonePope(currentPope);
}

export function getPreviousPope() {
  return clonePope(popes[1]);
}

export function listPopes() {
  return popes.map(clonePope);
}

export function getPopeByName(name) {
  const query = normalizeName(name);
  const pope = popes.find((candidate) => {
    const names = [candidate.id, candidate.name, candidate.birthName];
    return names.some((value) => normalizeName(value) === query);
  });

  return clonePope(pope);
}

export function getPopeByDate(date) {
  const query = toIsoDate(date);
  const pope = popes.find(
    (candidate) =>
      candidate.elected <= query &&
      (candidate.pontificateEnd === null || query <= candidate.pontificateEnd),
  );

  return clonePope(pope);
}
