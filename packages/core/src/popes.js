import { currentPope, popes } from "./data/popes.js";
import { toIsoDate } from "./date-utils.js";

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
