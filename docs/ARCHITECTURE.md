# Architecture

Habemus Papam is a pnpm monorepo with one public package and two private
interfaces:

```text
packages/
├── core/        # TypeScript domain API and published npm package
├── cli/         # CLI source, tests, and bundle
└── extension/   # Chrome extension source, tests, and bundle
```

## Data flow

```text
core data and rules
    ├── npm consumers
    ├── CLI → bundled into the npm package
    └── Chrome extension → browser bundle
```

The core is the single source of truth for papal records and date rules. The CLI
and extension contain only interface-specific parsing and rendering.

## Responsibilities

| Component           | Responsibility                     |
| ------------------- | ---------------------------------- |
| `core/src/data`     | Sourced papal records              |
| `core/src/popes.ts` | Record queries                     |
| `core/src/dates.ts` | Election and calendar calculations |
| `core/src/stats.ts` | Completed-pontificate statistics   |
| `core/src/index.ts` | Public API boundary                |
| `cli`               | Terminal commands and output       |
| `extension`         | Browser UI                         |

The core compiles strict TypeScript to ESM JavaScript and declarations in
`packages/core/dist`. The package `exports` map exposes only the root API.

During `prepack`, esbuild bundles the private CLI into
`packages/core/dist/cli.js`; `packages/core/bin/cli.js` is its launcher. The
extension build creates a separate browser bundle in `packages/extension/dist`.

## Design rules

- Core code does not depend on terminal, HTML, or Chrome APIs.
- Consumers use only the public root import.
- Query and statistics results are copies of internal data.
- Date-dependent functions accept a reference date for deterministic tests.
- Date-only elapsed arithmetic uses UTC to avoid daylight-saving differences.
- Statistics include completed pontificates only.
- Historical records require primary sources and boundary tests.
- Public changes preserve backward compatibility when possible.

See [API.md](./API.md) for the public contract and
[DATA-SOURCES.md](./DATA-SOURCES.md) for dataset provenance.

## Automation

CI checks formatting, linting, TypeScript, tests, coverage, the CLI, extension,
generated API site, and installed npm tarball on supported Node.js versions.
TypeDoc deploys to GitHub Pages. Changesets and npm Trusted Publishing manage
releases, provenance, tags, and GitHub releases.

See [DEVELOPMENT.md](./DEVELOPMENT.md) and [PUBLISHING.md](./PUBLISHING.md) for
commands and release setup.
