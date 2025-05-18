# Habemus Papam

✝️ Information about the current Pope — available via CLI, NPM package, and Chrome extension.

[![npm](https://img.shields.io/npm/v/habemus-papam?color=blue)](https://www.npmjs.com/package/habemus-papam)
[![MIT License](https://img.shields.io/badge/license-MIT-green)](https://github.com/viniciuspizettadesouza/habemus-papam/blob/main/LICENSE)

---

## 📦 Install

```bash
pnpm add habemus-papam
# or
npm install habemus-papam
```

## 🖥️ CLI Usage

```bash
npx habemus-papam
```

Output:
```
Habemus Papam!
Pope Leo XIV (Robert Francis Prevost) was elected on 2025-05-08.
Today is the election day of the current pope!
```

### ▶️ Run CLI locally (monorepo)

```bash
pnpm run start:cli
```

---

## 📚 Usage as a Library

```js
import { isElectionDayToday, getCurrentPope } from 'habemus-papam';

console.log(getCurrentPope());
// { name: "Pope Leo XIV", birthName: "Robert Francis Prevost", elected: "2025-05-08" }
console.log(isElectionDayToday());
// true if today is 2025-05-08
```

## 🧩 Chrome Extension

See [`packages/extension/`](packages/extension/)

To load:
1. Go to `chrome://extensions/`
2. Enable Developer Mode
3. Load `packages/extension/`

```bash
pnpm run zip-extension
```

This will create `habemus-papam-extension.zip` at the root.

---

## 🛠️ Monorepo Structure

```bash
habemus-papam/
├── packages/
│   ├── core/         # CLI + npm package
│   └── extension/    # Chrome Extension
├── .changeset/       # Changeset files for versioning
├── pnpm-workspace.yaml
└── package.json      # Root workspace config
```

---

## 🚀 Publishing Workflow

```bash
pnpm changeset              # create a version bump entry
pnpm run version-packages   # apply the version
pnpm run release-packages   # publish to npm
```

---

## 👤 Author

Vinicius Souza  
[https://github.com/viniciuspizettadesouza](https://github.com/viniciuspizettadesouza)

---

## 📄 License

[MIT](./license.md)
