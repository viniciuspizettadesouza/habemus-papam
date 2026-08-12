# Architecture

## Baseline (`v1.0.3`)

The project is a pnpm monorepo with two packages:

```text
habemus-papam/
├── packages/
│   ├── core/
│   │   ├── src/index.js   # Reusable API
│   │   └── bin/cli.js     # Command-line interface
│   └── extension/
│       ├── manifest.json
│       ├── popup.html
│       └── popup.js       # UI and a copy of the current logic
├── .changeset/
├── package.json
└── pnpm-workspace.yaml
```

The `core` package has two responsibilities:

1. It exposes the JavaScript API published as `habemus-papam`.
2. It provides the executable used by `npx habemus-papam`.

The executable in `bin/cli.js` is a thin process adapter. Command parsing,
formatting, and JSON serialization live in `bin/commands.js`, which returns
output and an exit code without writing directly to the terminal. This keeps
the CLI behavior deterministic and independently testable until it is moved to
its own workspace package.

The Chrome extension is distributed separately. Currently, `popup.js` repeats
`getCurrentPope()` and the date rule instead of importing them from the core.

## Current flow

```text
packages/core/src/data/popes.js
        ├── dates.js
        ├── popes.js
        └── stats.js
               ↓
            index.js
               ├── npm consumer
               └── packages/core/bin/cli.js

packages/extension/popup.js
        └── Chrome Extension
```

This separation keeps the initial version simple, but it allows the core and
extension to become inconsistent. Until the extension consumes the core, every
domain change must be applied and verified in both implementations.

The core now distinguishes the exact 2025 election date from its anniversary.
The extension uses the same anniversary semantics, but still duplicates that
rule locally.

The bundled dataset contains six sourced records from Paul VI through Leo XIV.
Public query functions return copies so consumers cannot mutate the internal
source of truth. Dataset provenance and boundary conventions are recorded in
[DATA-SOURCES.md](./DATA-SOURCES.md).

Date-only parsing and calendar arithmetic live in `date-utils.js`. Public date
APIs accept ISO dates or `Date` instances, convert them to local-calendar ISO
dates at the boundary, and perform elapsed-day arithmetic in UTC. This avoids
daylight-saving transitions changing date-only results.

`stats.js` derives deterministic statistics from completed pontificates only.
It returns copies of both records and duration objects, preserving internal
dataset immutability.

GitHub Actions validates the project on Node.js 22, 24, and 26 for pushes and
pull requests targeting `main`. The workflow installs from the committed
lockfile, runs tests and coverage checks, smoke-tests the CLI, and inspects the
npm package artifact.

## Evolution direction

The project should evolve by separating data, domain rules, and interfaces:

```text
papal data
    ↓
core: queries and date rules
    ├── CLI
    ├── Chrome Extension
    └── npm consumers
```

The core now uses the following internal structure:

```text
packages/
├── core/
│   └── src/
│       ├── data/
│       ├── dates.js
│       ├── popes.js
│       ├── stats.js
│       └── index.js
├── cli/                 # Planned when the CLI grows
└── extension/           # Still duplicates core logic
```

## Architecture rules

- The core contains data and domain rules without knowledge of terminals, HTML,
  or Chrome.
- The CLI and extension consume the core's public API.
- Papal data has a single source of truth.
- Date-dependent functions accept a date argument to enable deterministic tests.
- Public API changes preserve backward compatibility whenever possible.
- Historical data records its sources and verification date.
- A new tool is added only when it addresses an existing project need.

## Future decisions

The following changes are intentional, but do not belong to the baseline:

1. Expand the sourced dataset beyond Paul VI when needed.
2. Extract the CLI when it grows.
3. Build the extension so that it can consume the core.
4. Migrate the core to TypeScript and publish artifacts from `dist`.

Each decision should be implemented as a small delivery accompanied by tests
and an update to this documentation.
