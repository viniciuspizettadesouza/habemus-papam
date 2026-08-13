# habemus-papam

## 1.2.0

### Minor Changes

- f4da542: Publish the core library as compiled JavaScript with bundled TypeScript
  declarations, explicit package entry points, and a Node.js 22 minimum while
  preserving the documented runtime API.

## 1.1.0

### Minor Changes

- fb7db27: Add a sourced recent-pope dataset with APIs for listing popes and querying by
  name or pontificate date.
- c4ef65c: Distinguish the exact papal election date from its yearly anniversary while
  preserving `isElectionDayToday()` as a deprecated compatibility alias.
- a55a98d: Add date-only APIs for pontificate duration, pope age, the next election
  anniversary, and elapsed days since election.
- 25a5793: Add current, previous, history, pope lookup, anniversary, help, and JSON CLI
  modes while preserving the original no-argument output.
- 9290970: Add longest, shortest, and average pontificate statistics derived from the
  completed records in the bundled dataset.

## 1.0.3

### Patch Changes

- Update readme

## 1.0.2

### Patch Changes

- Migrated project to a pnpm monorepo structure, separating the core CLI/library and Chrome extension into distinct packages
