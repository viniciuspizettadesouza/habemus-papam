# habemus-papam

Papal information for JavaScript and the command line.

[![npm version](https://img.shields.io/npm/v/habemus-papam?color=blue)](https://www.npmjs.com/package/habemus-papam) [![CI](https://github.com/viniciuspizettadesouza/habemus-papam/actions/workflows/ci.yml/badge.svg)](https://github.com/viniciuspizettadesouza/habemus-papam/actions/workflows/ci.yml) [![license](https://img.shields.io/npm/l/habemus-papam)](LICENSE)

“Habemus Papam” means “We have a pope.” This package provides a sourced modern
papal dataset, date calculations, pontificate statistics, and a CLI for quickly
reading the same information in a terminal.

## Features

- Current, previous, name-based, and date-based pope queries
- Sourced records from Paul VI through Leo XIV
- Pontificate duration, age, elapsed-day, and anniversary calculations
- Longest, shortest, and average completed-pontificate statistics
- Human-readable and JSON command-line output
- ESM JavaScript with bundled TypeScript declarations

## Install

```bash
npm install habemus-papam
```

Node.js 22 or newer is required.

## Quick start

```js
import {
  getCurrentPope,
  getPopeByDate,
  getPontificateDuration,
} from "habemus-papam";

const current = getCurrentPope();

console.log(current.name); // "Pope Leo XIV"
console.log(getPopeByDate("2015-01-01")?.name); // "Pope Francis"
console.log(getPontificateDuration(current, "2026-05-08"));
// { years: 1, months: 0, days: 0, totalDays: 365 }
```

Returned pope records are copies, so changing one does not mutate the bundled
dataset.

## Library API

| Area            | Functions                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------- |
| Pope queries    | `getCurrentPope`, `getPreviousPope`, `listPopes`, `getPopeByName`, `getPopeByDate`        |
| Dates           | `getPontificateDuration`, `getPopeAge`, `getNextElectionAnniversary`, `daysSinceElection` |
| Election checks | `isElectionDay`, `isElectionAnniversary`                                                  |
| Statistics      | `getLongestPontificate`, `getShortestPontificate`, `getAveragePontificateDuration`        |

Date calculations accept valid `Date` instances or ISO calendar dates in
`YYYY-MM-DD` format where documented. Searches return `null` when no known pope
matches. Invalid inputs throw `TypeError` or `RangeError`; consult the API
reference for each function's exact contract.

The deprecated `isElectionDayToday()` export remains available for backward
compatibility. New code should use `isElectionDay()`.

## CLI

Run the package without installing it globally:

```bash
npx habemus-papam
```

```text
Habemus Papam!
Pope Leo XIV (Robert Francis Prevost) was elected on 2025-05-08.
```

Available commands:

```bash
npx habemus-papam current
npx habemus-papam previous
npx habemus-papam history
npx habemus-papam pope francis
npx habemus-papam pope "John Paul II"
npx habemus-papam anniversary
npx habemus-papam --help
```

Add `--json` to a data command for machine-readable output:

```bash
npx habemus-papam current --json
npx habemus-papam history --json
```

Invalid commands, options, and pope names write an error to standard error and
set a non-zero exit code.

## Compatibility

- Node.js 22 or newer
- ESM only
- TypeScript declarations included
- Public imports are available only from `habemus-papam`; internal files are not
  exported

## Documentation

- [Generated API documentation](https://viniciuspizettadesouza.github.io/habemus-papam/)
- [Detailed API guide](https://github.com/viniciuspizettadesouza/habemus-papam/blob/main/docs/API.md)
- [Papal data sources](https://github.com/viniciuspizettadesouza/habemus-papam/blob/main/docs/DATA-SOURCES.md)
- [Project repository](https://github.com/viniciuspizettadesouza/habemus-papam)

The project also provides a [Chrome extension](https://chromewebstore.google.com/detail/habemus-papam/ccmjegfeapjehgfmdckmmllgpblojboi)
built from the same papal data and date rules.

## License

[MIT](LICENSE) © Vinicius Souza
