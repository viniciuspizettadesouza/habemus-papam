# API Reference

`habemus-papam` is an ESM package for Node.js 22 or newer. Import all public
functions and types from the package root:

```js
import {
  getCurrentPope,
  getPopeByName,
  getPontificateDuration,
} from "habemus-papam";

const pope = getPopeByName("Francis");
const current = getCurrentPope();
const duration = getPontificateDuration(current, "2026-05-08");
```

Internal files are not exported.

## Date conventions

`DateInput` accepts a valid `Date` or an ISO date in `YYYY-MM-DD` format. For a
`Date`, the local calendar date is used and the time is ignored. Date-only
arithmetic runs in UTC to avoid daylight-saving changes.

`isElectionDay()` and `isElectionAnniversary()` accept only `Date` instances.
Optional pope and date arguments default to the current pope and today.

## Functions

### Pope queries

| Function              | Result                                                                                              |
| --------------------- | --------------------------------------------------------------------------------------------------- |
| `getCurrentPope()`    | Current pope                                                                                        |
| `getPreviousPope()`   | Pope immediately before the current pope                                                            |
| `listPopes()`         | Records in reverse chronological order                                                              |
| `getPopeByName(name)` | Match by ID, papal name, or birth name; ignores case, punctuation, titles, and diacritics           |
| `getPopeByDate(date)` | Pope serving on an inclusive pontificate date, or `null` during a vacant see or outside the dataset |

Query functions return mutable copies and never expose the internal dataset.

### Date calculations

| Function                                   | Result                                                                                              |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------- |
| `getPontificateDuration(pope?, date?)`     | Calendar years, months, days, and total elapsed days; completed pontificates stop at their end date |
| `getPopeAge(pope?, date?)`                 | Age in completed calendar years                                                                     |
| `getNextElectionAnniversary(pope?, date?)` | First anniversary strictly after the reference date as an ISO date                                  |
| `daysSinceElection(pope?, date?)`          | Elapsed days since election, starting at zero; does not stop at the pontificate end                 |

```js
getPontificateDuration(getCurrentPope(), "2026-05-08");
// { years: 1, months: 0, days: 0, totalDays: 365 }
```

### Election checks

| Function                       | Result                                                               |
| ------------------------------ | -------------------------------------------------------------------- |
| `isElectionDay(date?)`         | Whether the date is the current pope's exact election date           |
| `isElectionAnniversary(date?)` | Whether the date is an election anniversary on or after the election |
| `isElectionDayToday()`         | Deprecated alias for `isElectionDay()` using today                   |

### Statistics

| Function                          | Result                                             |
| --------------------------------- | -------------------------------------------------- |
| `getLongestPontificate()`         | Longest completed pontificate and its duration     |
| `getShortestPontificate()`        | Shortest completed pontificate and its duration    |
| `getAveragePontificateDuration()` | Rounded mean days and completed-record sample size |

Statistics exclude the current pontificate and return copies.

## Errors

Invalid values throw `TypeError`. Impossible chronology, such as a reference
date before an election or birth, throws `RangeError`. Name and date searches
return `null` when valid input has no match.

## Types

| Type                         | Purpose                                                                     |
| ---------------------------- | --------------------------------------------------------------------------- |
| `Pope`                       | Full pope record with identity, birth, election, and pontificate-end fields |
| `DateInput`                  | `Date \| string`                                                            |
| `PontificateInput`           | Election and pontificate-end fields required by date calculations           |
| `PopeAgeInput`               | `PontificateInput` plus birth date                                          |
| `PontificateDuration`        | Calendar components and `totalDays`                                         |
| `PontificateResult`          | Pope and calculated duration                                                |
| `AveragePontificateDuration` | `averageDays` and `sampleSize`                                              |

All record dates are ISO dates. `pontificateEnd` is `null` for the current pope.
The package includes TypeScript declarations; the generated documentation lists
the exact signatures and fields.
