# Architecture

## Current state (`v1.0.3`)

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

The Chrome extension is distributed separately. Currently, `popup.js` repeats
`getCurrentPope()` and the date rule instead of importing them from the core.

## Current flow

```text
packages/core/src/index.js
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

The intended structure when growth justifies the separation is:

```text
packages/
├── core/
│   └── src/
│       ├── data/
│       ├── dates.js
│       ├── popes.js
│       └── index.js
├── cli/
└── extension/
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

1. Add continuous integration for the existing automated tests.
2. Separate data from logic.
3. Create a verifiable historical dataset.
4. Extract the CLI when it grows.
5. Build the extension so that it can consume the core.
6. Migrate the core to TypeScript and publish artifacts from `dist`.

Each decision should be implemented as a small delivery accompanied by tests
and an update to this documentation.
