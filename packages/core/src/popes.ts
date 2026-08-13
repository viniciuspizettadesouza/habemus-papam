import { currentPope, popes } from "./data/popes.js";
import { toIsoDate } from "./date-utils.js";
import type { DateInput, Pope } from "./types.js";

function clonePope(pope: Readonly<Pope> | undefined): Pope | null {
  return pope ? { ...pope } : null;
}

function normalizeName(value: string): string {
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

export function getCurrentPope(): Pope {
  return { ...currentPope };
}

export function getPreviousPope(): Pope {
  return { ...(popes[1] as Readonly<Pope>) };
}

export function listPopes(): Pope[] {
  return popes.map((pope) => ({ ...pope }));
}

export function getPopeByName(name: string): Pope | null {
  const query = normalizeName(name);
  const pope = popes.find((candidate) => {
    const names = [candidate.id, candidate.name, candidate.birthName];
    return names.some((value) => normalizeName(value) === query);
  });

  return clonePope(pope);
}

export function getPopeByDate(date: DateInput): Pope | null {
  const query = toIsoDate(date);
  const pope = popes.find(
    (candidate) =>
      candidate.elected <= query &&
      (candidate.pontificateEnd === null || query <= candidate.pontificateEnd),
  );

  return clonePope(pope);
}
