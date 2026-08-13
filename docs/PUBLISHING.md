# Publishing

This document describes the existing manual release process. Continuous
integration validates changes, but publishing remains manual until the release
workflow is implemented and verified.

## Semantic versioning

The package follows Semantic Versioning:

- `patch`: a backward-compatible fix, for example `1.0.3` → `1.0.4`
- `minor`: a backward-compatible feature, for example `1.0.3` → `1.1.0`
- `major`: an incompatible change, for example `1.0.3` → `2.0.0`

Internal project growth does not require a major version. Use `major` only when
consumers need to change their code.

## 1. Prepare the environment

Run these commands from the repository root:

```bash
pnpm install
pnpm --filter habemus-papam start
```

Before publishing from a machine for the first time, authenticate with npm:

```bash
npm login
npm whoami
```

## 2. Create a Changeset

For a publishable change, run:

```bash
pnpm changeset
```

Select the `habemus-papam` package, choose `patch`, `minor`, or `major`, and
write a consumer-focused summary. Include the generated `.changeset/` file in
the same pull request as the change.

Changes limited to root documentation or private configuration generally do
not require a new package version.

## 3. Apply versions and update the changelog

When the changes are ready for a release, run:

```bash
pnpm run version-packages
```

Review the following before proceeding:

- The new version in `packages/core/package.json`
- `packages/core/CHANGELOG.md`
- The removal of Changesets that have been consumed

## 4. Validate the artifact

Run the CLI and preview the files that will be included in the package:

```bash
pnpm build:core
pnpm typecheck
pnpm start:cli
pnpm build:cli
pnpm --filter habemus-papam exec npm pack --dry-run
pnpm test:package
```

The package's `prepack` script rebuilds the TypeScript library and private CLI
workspace automatically. The tarball must contain compiled library JavaScript,
TypeScript declarations, and `dist/cli.js`. TypeScript source, tests, and build
configuration must remain excluded.

Confirm that the package contains the required library, CLI, README, and license
material without including private files or extension artifacts.

The package requires Node.js 22 or newer. Its `exports` map must keep the root
API resolvable from the packed artifact while preventing internal modules from
becoming accidental public entry points.

`pnpm test:package` creates an isolated temporary consumer, installs the packed
tarball, compiles a TypeScript import, runs a JavaScript import and the
installed CLI, checks the export boundary, and verifies the published file
allowlist. The temporary consumer is removed after the check.

The same checks run in CI and must pass before publishing:

```bash
pnpm lint
pnpm format:check
pnpm test
pnpm test:coverage
pnpm test:package
```

## 5. Publish

After reviewing the version and artifact, run:

```bash
pnpm run release-packages
```

Changesets publishes the changed packages according to `.changeset/config.json`,
which currently specifies public access.

Confirm the publication:

```bash
npm view habemus-papam version
npx habemus-papam
```

## 6. Record the release in Git

After validating the publication, push the version commit and corresponding tag
according to the repository's release workflow. Never move a tag that already
represents a published version.

## Planned evolution

The future process should use GitHub Actions and npm Trusted Publishing:

```text
Changeset
    ↓
release pull request
    ↓
tests and package validation
    ↓
OIDC publication with provenance
```

Until that automation exists and has been tested, this manual procedure remains
the reference.
