# Habemus Papam

A cross-platform JavaScript tool that provides information about the current Pope of the Catholic Church. It is available via CLI, npm package, and Chrome Extension.

[![npm](https://img.shields.io/npm/v/habemus-papam?color=blue)](https://www.npmjs.com/package/habemus-papam) [![CI](https://github.com/viniciuspizettadesouza/habemus-papam/actions/workflows/ci.yml/badge.svg)](https://github.com/viniciuspizettadesouza/habemus-papam/actions/workflows/ci.yml) [![MIT License](https://img.shields.io/badge/license-MIT-green)](https://github.com/viniciuspizettadesouza/habemus-papam/blob/main/license.md)

---

## ✝️ Overview

This monorepo delivers papal information across multiple environments:

- 📦 **NPM Package** – A reusable JavaScript library and CLI tool to access papal data programmatically.  
  👉 **[View on npm](https://www.npmjs.com/package/habemus-papam)**
- 🧩 **Chrome Extension** – A browser extension that displays current Pope information in real time.  
  👉 **[Install via Chrome Web Store](https://chromewebstore.google.com/detail/habemus-papam/ccmjegfeapjehgfmdckmmllgpblojboi)**

---

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

---

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
} from 'habemus-papam';

console.log(getCurrentPope());
console.log(getPopeByName('Francis'));
console.log(getPopeByDate('2015-01-01'));
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

`isElectionDay()` matches May 8, 2025 only. `isElectionAnniversary()` matches
May 8 from 2025 onward. Both accept an optional `Date` and use its local
calendar date. The original `isElectionDayToday()` export remains available as
a deprecated alias.

The package includes TypeScript declarations for every public function and
data structure; no separate `@types` package is required.

The supported runtime is Node.js 22 or newer. CI tests the maintained
even-numbered Node.js release lines covered by the project.

---

## 🛠️ Developer Usage

Project guides:

- [Create the project from scratch](docs/FROM-SCRATCH.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Papal data sources](docs/DATA-SOURCES.md)
- [Publishing](docs/PUBLISHING.md)

### 🧩 Chrome Extension

📁 See: [`packages/extension/`](packages/extension/)

To load manually:

1. Build the extension with `pnpm run build:extension`.
2. Go to `chrome://extensions/`.
3. Enable Developer Mode.
4. Load the folder: `packages/extension/dist/`.

To publish:

```bash
pnpm run zip-extension
```

This creates `habemus-papam-extension.zip` at the root.

### 🔃 Monorepo commands

Install dependencies:

```bash
pnpm install
```

Run the tests:

```bash
pnpm test
pnpm test:coverage
```

Build and type-check the core package:

```bash
pnpm run build:core
pnpm run typecheck
```

Test the exact npm tarball as an isolated JavaScript, TypeScript, and CLI
consumer:

```bash
pnpm run test:package
```

#### ▶️ Run CLI locally (monorepo)

```bash
pnpm run start:cli
```

Build the executable embedded in the npm package:

```bash
pnpm run build:cli
```

#### ✏️ Create a version bump:

```bash
pnpm changeset
```

#### 📄 Apply version and changelog:

```bash
pnpm run version-packages
```

#### 🚀 Publish to npm:

```bash
pnpm run release-packages
```

---

## 🗂️ Monorepo Structure

```bash
habemus-papam/
├── packages/
│   ├── core/         # TypeScript library + published npm package
│   ├── cli/          # CLI source, tests, and bundler
│   └── extension/    # Chrome Extension source, tests, and bundler
├── .changeset/       # Changeset files for versioning
├── pnpm-workspace.yaml
└── package.json      # Root workspace config + scripts
```

---

## 👤 Author

Vinicius Souza  
[https://github.com/viniciuspizettadesouza](https://github.com/viniciuspizettadesouza)

---

## 📄 License

[MIT](https://github.com/viniciuspizettadesouza/habemus-papam/blob/main/license.md)
