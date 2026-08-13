# Publishing

Releases use Changesets, GitHub Actions, and npm Trusted Publishing. The normal
flow requires no npm token.

## One-time setup

Create an npm GitHub Actions trusted publisher for `habemus-papam`:

| Setting              | Value                    |
| -------------------- | ------------------------ |
| Organization or user | `viniciuspizettadesouza` |
| Repository           | `habemus-papam`          |
| Workflow filename    | `release.yml`            |
| Environment          | `npm`                    |
| Allowed action       | `npm publish`            |

In GitHub:

1. Create an environment named `npm`.
2. Optionally require approval for that environment.
3. Under **Settings → Actions → General**, allow Actions to create pull requests.

The publish job uses OIDC and automatically receives npm provenance. Do not add
an `NPM_TOKEN` secret. After the first trusted publication succeeds, revoke
obsolete automation tokens.

## Version changes

Run `pnpm changeset` for each consumer-visible change. Select
`habemus-papam` and choose:

- `patch` for a backward-compatible fix
- `minor` for a backward-compatible feature
- `major` for an incompatible change

Commit the generated `.changeset/*.md` file with the implementation. CI must
pass before merging; see [DEVELOPMENT.md](./DEVELOPMENT.md#checks).

## Automated release

```text
Changeset on main
      ↓
release pull request
      ↓ merge after review
version and changelog update
      ↓
npm publication with provenance
      ↓
version tag and GitHub release
```

The Release workflow creates or updates the release pull request. Review its
package version and `packages/core/CHANGELOG.md`, then merge it.

The next run publishes only if the exact version is absent from npm. Tag and
GitHub release creation are idempotent, so rerunning the workflow can complete a
partially finalized release. Never move a published version tag.

## Verification

```bash
npm view habemus-papam version
npx habemus-papam@latest
```

Confirm the matching npm provenance, Git tag, and GitHub release.

## Manual recovery

Rerun the Release workflow first. If GitHub Actions cannot publish, run the
[development checks](./DEVELOPMENT.md#checks), then publish with an authorized
npm account and current 2FA code:

```bash
cd packages/core
npm publish --access public --otp=123456
```

Replace `123456` with the current authenticator code. Do not create a bypass-2FA
token. Create the tag and GitHub release only after confirming the npm version.
