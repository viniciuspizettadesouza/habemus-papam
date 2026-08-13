# habemus-papam

A cross-platform JavaScript tool that provides information about the current Pope of the Catholic Church. This is the reusable library package; the separately maintained CLI is bundled into this package for `npx` compatibility.

## ✝️ About "Habemus Papam"

"Habemus Papam" means "We have a Pope."
It is the traditional announcement by the Cardinal Protodeacon from St. Peter's Basilica, marking the election of a new pope — a ritual dating back to the 15th century symbolizing continuity in the Catholic Church.

## 📦 Install

```bash
pnpm add habemus-papam
# or
npm install habemus-papam
```

## 🖥️ CLI Usage

```bash
npx habemus-papam
```

Output:

```
Habemus Papam!
Pope Leo XIV (Robert Francis Prevost) was elected on 2025-05-08.
Today is the election day of the current pope!
```

The no-argument command remains backward-compatible. Additional commands:

```bash
npx habemus-papam current
npx habemus-papam previous
npx habemus-papam history
npx habemus-papam pope francis
npx habemus-papam pope "John Paul II"
npx habemus-papam anniversary
npx habemus-papam --help
```

Add `--json` to any data command for machine-readable output:

```bash
npx habemus-papam --json | jq '.name'
npx habemus-papam history --json
```

Invalid commands, options, and pope names write an error to standard error and
set a non-zero exit code.

The package ships its own TypeScript declarations, so TypeScript consumers do
not need to install a separate `@types` package.

Node.js 22 or newer is required. The package exposes its documented API only
through the root `habemus-papam` entry point.

## 📚 Usage as a Library

```js
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
  listPopes,
  isElectionAnniversary,
  isElectionDay,
} from "habemus-papam";

console.log(getCurrentPope());
console.log(getPopeByName("Francis"));
console.log(getPopeByDate("2015-01-01"));
console.log(getPreviousPope());
console.log(listPopes());
console.log(getPontificateDuration());
console.log(getPopeAge());
console.log(getNextElectionAnniversary());
console.log(daysSinceElection());
console.log(getLongestPontificate());
console.log(getShortestPontificate());
console.log(getAveragePontificateDuration());
console.log(isElectionDay());
console.log(isElectionAnniversary());
```

Pope records contain `id`, `name`, `birthName`, `birthDate`, `elected`, and
`pontificateEnd`. `listPopes()` returns the six bundled records in reverse
chronological order. Name searches are case-insensitive and accept a papal
name, record ID, or birth name. Date searches accept an ISO date string or a
`Date` and return `null` during a vacant see or outside the available history.

Date calculations default to the current pope and today, or accept a pope
record and a `Date` or ISO date string. `getPontificateDuration()` returns
calendar `years`, `months`, and `days` plus `totalDays`; completed pontificates
stop at their recorded end date. `getPopeAge()` returns completed years,
`getNextElectionAnniversary()` returns the first anniversary strictly after the
reference date, and `daysSinceElection()` returns elapsed calendar days.

Pontificate statistics use completed records only, keeping results stable while
the current pontificate is ongoing. The longest and shortest functions return
the pope and full duration. The average returns rounded `averageDays` and the
completed `sampleSize`.

See the repository's [papal data sources](https://github.com/viniciuspizettadesouza/habemus-papam/blob/main/docs/DATA-SOURCES.md)
for the dataset provenance and date conventions.

`isElectionDay()` matches May 8, 2025 only. `isElectionAnniversary()` matches
May 8 from 2025 onward. Both accept an optional `Date` and use its local
calendar date. The original `isElectionDayToday()` export remains available as
a deprecated alias.

## 🧩 Chrome Extension

This package is part of a monorepo that also includes a browser extension.  
🧩 [View on Chrome Web Store](https://chromewebstore.google.com/detail/habemus-papam/ccmjegfeapjehgfmdckmmllgpblojboi)

## 👤 Author

Vinicius Souza  
[https://github.com/viniciuspizettadesouza](https://github.com/viniciuspizettadesouza)

## 📄 License

Licensed under the [MIT License](https://github.com/viniciuspizettadesouza/habemus-papam/blob/main/license.md).
