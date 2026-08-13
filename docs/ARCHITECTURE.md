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

In the baseline, the `core` package had two responsibilities:

1. It exposes the JavaScript API published as `habemus-papam`.
2. It provides the executable used by `npx habemus-papam`.

The Chrome extension is distributed separately. In that version, `popup.js`
repeated `getCurrentPope()` and the date rule instead of importing them from
the core.

## Current architecture

The CLI and Chrome extension now have their own private workspace packages.
Both import only the core's public API. Interface-specific adapters, rendering,
tests, and build configuration no longer live in the core package.

The core is authored in strict TypeScript. The TypeScript compiler emits ESM
JavaScript and declarations into `packages/core/dist`; npm consumers never
execute source files directly.

To preserve both `import ... from "habemus-papam"` and
`npx habemus-papam`, esbuild creates a self-contained CLI executable at
`packages/core/dist/cli.js` during `prepack`. A two-line compatibility launcher
at `packages/core/bin/cli.js` loads that generated artifact. Both files are
published inside the existing npm package, but the bundle is not treated as
source code.

The extension uses esbuild to create a self-contained browser script. Its build
copies the manifest, popup HTML, and icon into `packages/extension/dist`, which
is the only directory loaded into Chrome or included in the Web Store archive.

## Current flow

```text
packages/core/src/data/popes.ts
        ├── dates.ts
        ├── popes.ts
        └── stats.ts
               ↓
            index.ts
               ↓ tsc
        packages/core/dist/
        ├── index.js
        ├── index.d.ts
        └── supporting modules
               ↓ published package
               ├── npm consumers
               ├── packages/cli/src
               │         ↓ esbuild
               │  packages/core/dist/cli.js
               │         ↓
               │  packages/core/bin/cli.js
               │         ↓
               │  npx habemus-papam
               └── packages/extension/src
                         ↓ esbuild
                  packages/extension/dist
                         ↓
                  Chrome Extension
```

The core is the single source of truth for papal data and date rules. The CLI
and extension contain only interface-specific behavior, so domain changes are
implemented and verified once.

The bundled dataset contains six sourced records from Paul VI through Leo XIV.
Public query functions return copies so consumers cannot mutate the internal
source of truth. Dataset provenance and boundary conventions are recorded in
[DATA-SOURCES.md](./DATA-SOURCES.md).

Date-only parsing and calendar arithmetic live in `date-utils.ts`. Public date
APIs accept ISO dates or `Date` instances, convert them to local-calendar ISO
dates at the boundary, and perform elapsed-day arithmetic in UTC. This avoids
daylight-saving transitions changing date-only results.

`stats.ts` derives deterministic statistics from completed pontificates only.
It returns copies of both records and duration objects, preserving internal
dataset immutability.

GitHub Actions validates the project on Node.js 22, 24, and 26 for pushes and
pull requests targeting `main`. The workflow installs from the committed
lockfile, compiles and type-checks the core, runs tests and coverage checks,
smoke-tests the CLI, builds the Chrome extension, and inspects the npm package
artifact.

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
│   ├── src/
│   │   ├── data/
│   │   ├── dates.ts
│   │   ├── popes.ts
│   │   ├── stats.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── type-tests/
│   ├── build.mjs
│   └── tsconfig.json
├── cli/
│   ├── src/
│   ├── tests/
│   └── build.mjs
└── extension/
    ├── src/
    ├── tests/
    ├── build.mjs
    ├── manifest.json
    └── popup.html
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
2. Add a restrictive package `exports` map only after deciding whether deep
   imports need a compatibility period.
3. Declare a Node.js engine range alongside an explicit support policy.

Each decision should be implemented as a small delivery accompanied by tests
and an update to this documentation.
