import {
  daysSinceElection,
  getAveragePontificateDuration,
  getCurrentPope,
  getLongestPontificate,
  getNextElectionAnniversary,
  getPopeByDate,
  getPopeByName,
  getPopeAge,
  getPontificateDuration,
  getPreviousPope,
  getShortestPontificate,
  isElectionAnniversary,
  isElectionDay,
  listPopes,
  type AveragePontificateDuration,
  type DateInput,
  type Pope,
  type PopeAgeInput,
  type PontificateDuration,
  type PontificateInput,
  type PontificateResult,
} from "../dist/index.js";

const date: DateInput = "2026-05-08";
const current: Pope = getCurrentPope();
const pontificate: PontificateInput = current;
const popeWithBirthDate: PopeAgeInput = current;
const previous: Pope = getPreviousPope();
const history: Pope[] = listPopes();
const byName: Pope | null = getPopeByName("Francis");
const byDate: Pope | null = getPopeByDate(date);
const duration: PontificateDuration = getPontificateDuration(pontificate, date);
const age: number = getPopeAge(popeWithBirthDate, date);
const anniversary: string = getNextElectionAnniversary(current, date);
const elapsedDays: number = daysSinceElection(current, date);
const longest: PontificateResult = getLongestPontificate();
const shortest: PontificateResult = getShortestPontificate();
const average: AveragePontificateDuration = getAveragePontificateDuration();
const electionDay: boolean = isElectionDay(new Date());
const electionAnniversary: boolean = isElectionAnniversary(new Date());

void [
  previous,
  history,
  byName,
  byDate,
  duration,
  age,
  anniversary,
  elapsedDays,
  longest,
  shortest,
  average,
  electionDay,
  electionAnniversary,
];
