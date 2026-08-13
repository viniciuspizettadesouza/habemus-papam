# Development

## Setup

Requirements: Node.js 22+, pnpm 10.11.0 through Corepack, and `zip` for the
extension archive.

```bash
corepack enable pnpm
pnpm install --frozen-lockfile
```

## Checks

```bash
pnpm lint
pnpm format:check
pnpm test
pnpm test:coverage
pnpm test:package
pnpm docs:api
pnpm build:extension
```

Use `pnpm format` to apply formatting. `test:package` installs the packed
tarball in a temporary consumer and verifies JavaScript, TypeScript, CLI,
exports, and published files.

## Common commands

| Command                | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `pnpm build:core`      | Compile the core to `packages/core/dist` |
| `pnpm typecheck`       | Check public TypeScript declarations     |
| `pnpm start:cli`       | Run the CLI from source                  |
| `pnpm build:cli`       | Build the npm CLI bundle                 |
| `pnpm build:extension` | Build `packages/extension/dist`          |
| `pnpm zip-extension`   | Create `habemus-papam-extension.zip`     |
| `pnpm docs:api`        | Generate TypeDoc in `site/api`           |

To test the extension, build it and load `packages/extension/dist` from
`chrome://extensions/` with Developer Mode enabled.

For the first documentation deployment, select **GitHub Actions** under
**Settings → Pages → Build and deployment**.

## Changesets

Run `pnpm changeset` for consumer-visible changes to `habemus-papam` and commit
the generated file with the implementation. Documentation-only and private
workspace changes normally do not need one.

See [PUBLISHING.md](./PUBLISHING.md) for releases.
