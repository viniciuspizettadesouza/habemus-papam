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

/** Returns a mutable copy of the current pope record. */
export function getCurrentPope(): Pope {
  return { ...currentPope };
}

/** Returns a mutable copy of the pope immediately before the current pope. */
export function getPreviousPope(): Pope {
  return { ...(popes[1] as Readonly<Pope>) };
}

/** Returns mutable record copies in reverse chronological order. */
export function listPopes(): Pope[] {
  return popes.map((pope) => ({ ...pope }));
}

/**
 * Finds a pope by ID, papal name, or birth name.
 *
 * Matching is case-insensitive and ignores titles, punctuation, and diacritics.
 *
 * @param name - Non-empty name or record ID.
 * @returns A mutable record copy, or null when no record matches.
 */
export function getPopeByName(name: string): Pope | null {
  const query = normalizeName(name);
  const pope = popes.find((candidate) => {
    const names = [candidate.id, candidate.name, candidate.birthName];
    return names.some((value) => normalizeName(value) === query);
  });

  return clonePope(pope);
}

/**
 * Finds the pope serving on an inclusive pontificate date.
 *
 * @param date - ISO calendar date or Date using its local calendar fields.
 * @returns A mutable record copy, or null outside known pontificates.
 */
export function getPopeByDate(date: DateInput): Pope | null {
  const query = toIsoDate(date);
  const pope = popes.find(
    (candidate) =>
      candidate.elected <= query &&
      (candidate.pontificateEnd === null || query <= candidate.pontificateEnd),
  );

  return clonePope(pope);
}
