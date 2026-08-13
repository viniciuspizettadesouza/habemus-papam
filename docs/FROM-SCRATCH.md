# Creating the Project from Scratch

This is the minimum path for recreating the original library, CLI, extension,
and pnpm workspace. The current implementation is described in
[ARCHITECTURE.md](./ARCHITECTURE.md).

## 1. Create the workspace

```bash
mkdir habemus-papam
cd habemus-papam
git init
pnpm init
mkdir -p packages/core/src packages/core/bin packages/extension
```

Mark the root package as private and create `pnpm-workspace.yaml`:

```yaml
packages:
  - "packages/*"
```

## 2. Add the package

Create an ESM package in `packages/core` with a public `src/index.js` and a
`bin/cli.js` executable. Its `package.json` needs at least:

```json
{
  "name": "habemus-papam",
  "version": "1.0.0",
  "type": "module",
  "main": "src/index.js",
  "bin": { "habemus-papam": "bin/cli.js" }
}
```

The library should export the data function; the CLI should import it and begin
with `#!/usr/bin/env node`. Verify both:

```bash
node --input-type=module -e "import('./packages/core/src/index.js').then(console.log)"
node packages/core/bin/cli.js
```

Before publishing, add description, keywords, author, license, repository,
homepage, issue tracker, package README, and license file.

## 3. Add the extension

Create `manifest.json`, `popup.html`, `popup.js`, and `icon.png` under
`packages/extension`. Use Manifest V3, then load the directory through
`chrome://extensions/` with Developer Mode enabled.

The initial extension may duplicate the core data for simplicity. The current
architecture removes that duplication through a browser bundle.

## 4. Install release tooling

```bash
pnpm install
pnpm add -Dw @changesets/cli
pnpm changeset init
```

Add root scripts for `changeset`, `changeset version`, and `changeset publish`.
See [PUBLISHING.md](./PUBLISHING.md) for the current automated process.

## 5. Inspect and publish

```bash
npm login
pnpm --filter habemus-papam exec npm pack --dry-run
pnpm --filter habemus-papam publish --access public
```

Check the tarball before publishing and never reuse an npm version. Add a
Changeset for every later consumer-visible release.

The repository keeps `v1.0.3` and `tutorial-baseline` tags as references for the
minimal implementation.
