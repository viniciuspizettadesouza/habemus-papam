# Creating the Project from Scratch

This guide records the minimum path for recreating Habemus Papam as an npm
package, CLI, Chrome extension, and pnpm workspace. It preserves the simplicity
of version `v1.0.3`; it is not intended to anticipate every future evolution of
the project.

## Prerequisites

- Node.js
- pnpm
- An npm account for publishing
- Git

## 1. Create the repository

```bash
mkdir habemus-papam
cd habemus-papam
git init
pnpm init
```

Mark the root package as private because it only coordinates the monorepo:

```json
{
  "name": "habemus-papam",
  "private": true,
  "packageManager": "pnpm@10.11.0"
}
```

## 2. Configure the workspace

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - "packages/*"
```

Create the directories for both projects:

```bash
mkdir -p packages/core/src packages/core/bin packages/extension
```

## 3. Create the library

Create `packages/core/package.json` as an ESM package:

```json
{
  "name": "habemus-papam",
  "version": "1.0.0",
  "main": "src/index.js",
  "type": "module"
}
```

Export the public API from `packages/core/src/index.js`:

```js
export function getCurrentPope() {
  return {
    name: "Pope Leo XIV",
    birthName: "Robert Francis Prevost",
    elected: "2025-05-08",
  };
}
```

Test the import locally before publishing:

```bash
node --input-type=module -e "import('./packages/core/src/index.js').then(console.log)"
```

## 4. Add the CLI

Create `packages/core/bin/cli.js` with a shebang and import the library:

```js
#!/usr/bin/env node
import { getCurrentPope } from "../src/index.js";

console.log(getCurrentPope());
```

Add the executable to `packages/core/package.json`:

```json
{
  "bin": {
    "habemus-papam": "bin/cli.js"
  },
  "scripts": {
    "start": "node bin/cli.js"
  }
}
```

Run the CLI inside the workspace:

```bash
pnpm --filter habemus-papam start
```

After publishing, consumers can run:

```bash
npx habemus-papam
```

## 5. Add package metadata

Before publishing, complete `packages/core/package.json` with:

- A description and keywords
- The license
- The author
- `repository` and its monorepo directory
- `homepage`
- The issue tracker address

Keep a `README.md` in the package and the license in the repository.

## 6. Create the extension

Create at least these files under `packages/extension`:

```text
manifest.json
popup.html
popup.js
icon.png
```

The `manifest.json` file must use Manifest V3 and point `default_popup` and
`default_icon` to these files. To test it, open `chrome://extensions`, enable
Developer Mode, and load the unpacked `packages/extension` directory.

In the initial version, the extension is independent and repeats the core data.
This duplication is documented as technical debt in `ARCHITECTURE.md`.

## 7. Install dependencies

Run this command from the repository root:

```bash
pnpm install
```

The command links the workspace packages and generates the lockfile, which
should be committed.

## 8. Configure Changesets

Install and initialize Changesets from the repository root:

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
```

Add the versioning scripts to the root `package.json`:

```json
{
  "scripts": {
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release-packages": "changeset publish"
  }
}
```

The complete workflow is documented in [PUBLISHING.md](./PUBLISHING.md).

## 9. Publish the first package

Authenticate and inspect the contents that will be published:

```bash
npm login
pnpm --filter habemus-papam exec npm pack --dry-run
```

Publish only after verifying the name, version, files, and metadata:

```bash
pnpm --filter habemus-papam publish --access public
```

Every subsequent version should include a Changeset. Never reuse a version that
has already been published to npm.

## 10. Preserve the educational baseline

Once the simple version is stable, tag its commit before continuing development:

```bash
git tag v1.0.3
git tag tutorial-baseline
git push origin v1.0.3 tutorial-baseline
```

This allows `main` to evolve while `tutorial-baseline` continues to demonstrate
the minimum implementation.
