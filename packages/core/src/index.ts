export {
  daysSinceElection,
  getNextElectionAnniversary,
  getPontificateDuration,
  getPopeAge,
  isElectionAnniversary,
  isElectionDay,
  isElectionDayToday,
} from "./dates.js";
export {
  getCurrentPope,
  getPopeByDate,
  getPopeByName,
  getPreviousPope,
  listPopes,
} from "./popes.js";
export {
  getAveragePontificateDuration,
  getLongestPontificate,
  getShortestPontificate,
} from "./stats.js";
export type {
  AveragePontificateDuration,
  DateInput,
  Pope,
  PopeAgeInput,
  PontificateDuration,
  PontificateInput,
  PontificateResult,
} from "./types.js";
