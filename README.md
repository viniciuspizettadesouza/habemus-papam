# Habemus Papam

Papal information for JavaScript, the command line, and Chrome.

[![npm](https://img.shields.io/npm/v/habemus-papam?color=blue)](https://www.npmjs.com/package/habemus-papam) [![CI](https://github.com/viniciuspizettadesouza/habemus-papam/actions/workflows/ci.yml/badge.svg)](https://github.com/viniciuspizettadesouza/habemus-papam/actions/workflows/ci.yml) [![MIT License](https://img.shields.io/badge/license-MIT-green)](https://github.com/viniciuspizettadesouza/habemus-papam/blob/main/license.md)

“Habemus Papam” means “We have a pope.” The project provides a sourced modern
papal dataset, date calculations, pontificate statistics, a CLI, and a Chrome
extension backed by the same core library.

## Features

- Current, previous, name-based, and date-based pope queries
- Sourced records from Paul VI through Leo XIV
- Pontificate duration, age, anniversary, and completed-pontificate statistics
- Human-readable and JSON command-line output
- ESM JavaScript with bundled TypeScript declarations

## Install

```bash
npm install habemus-papam
```

Node.js 22 or newer is required. The package is ESM-only and includes its own TypeScript declarations.

## Library

```js
import {
  getCurrentPope,
  getPopeByDate,
  getPontificateDuration,
} from "habemus-papam";

console.log(getCurrentPope());
console.log(getPopeByDate("2015-01-01"));
console.log(getPontificateDuration());
```

Returned pope records are copies, so changing one does not mutate the bundled
dataset. See the [API reference](docs/API.md) for every function, type, default,
and error.

### API overview

| Area            | Functions                                                                                 |
| --------------- | ----------------------------------------------------------------------------------------- |
| Pope queries    | `getCurrentPope`, `getPreviousPope`, `listPopes`, `getPopeByName`, `getPopeByDate`        |
| Dates           | `getPontificateDuration`, `getPopeAge`, `getNextElectionAnniversary`, `daysSinceElection` |
| Election checks | `isElectionDay`, `isElectionAnniversary`                                                  |
| Statistics      | `getLongestPontificate`, `getShortestPontificate`, `getAveragePontificateDuration`        |

## CLI

The original command remains available:

```bash
npx habemus-papam
```

Additional commands support current and previous popes, history, name lookup, anniversaries, and JSON output:

```bash
npx habemus-papam current
npx habemus-papam previous
npx habemus-papam history
npx habemus-papam pope francis
npx habemus-papam anniversary
npx habemus-papam --json
npx habemus-papam --help
```

Add `--json` to any data command for machine-readable output. Invalid commands,
options, and pope names write to standard error and set a non-zero exit code.

## Chrome extension

The [Chrome extension](https://chromewebstore.google.com/detail/habemus-papam/ccmjegfeapjehgfmdckmmllgpblojboi) uses the same core package and contains no duplicated papal data or date rules.

## Documentation

- [Generated API site](https://viniciuspizettadesouza.github.io/habemus-papam/)
- [API reference](docs/API.md)
- [Development](docs/DEVELOPMENT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Papal data sources](docs/DATA-SOURCES.md)
- [Publishing](docs/PUBLISHING.md)
- [Create a package from scratch](docs/FROM-SCRATCH.md)

## License

[MIT](license.md) © Vinicius Souza
