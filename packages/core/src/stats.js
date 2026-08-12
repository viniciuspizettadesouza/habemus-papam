import { popes } from "./data/popes.js";
import { calendarDifference } from "./date-utils.js";

function getCompletedPontificates() {
  return popes
    .filter((pope) => pope.pontificateEnd !== null)
    .map((pope) => ({
      pope,
      duration: calendarDifference(pope.elected, pope.pontificateEnd),
    }));
}

function cloneResult(result) {
  return {
    pope: { ...result.pope },
    duration: { ...result.duration },
  };
}

export function getLongestPontificate() {
  const result = getCompletedPontificates().reduce((longest, candidate) =>
    candidate.duration.totalDays > longest.duration.totalDays
      ? candidate
      : longest,
  );

  return cloneResult(result);
}

export function getShortestPontificate() {
  const result = getCompletedPontificates().reduce((shortest, candidate) =>
    candidate.duration.totalDays < shortest.duration.totalDays
      ? candidate
      : shortest,
  );

  return cloneResult(result);
}

export function getAveragePontificateDuration() {
  const completed = getCompletedPontificates();
  const totalDays = completed.reduce(
    (sum, result) => sum + result.duration.totalDays,
    0,
  );

  return {
    averageDays: Math.round(totalDays / completed.length),
    sampleSize: completed.length,
  };
}
