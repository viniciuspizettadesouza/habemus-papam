# Habemus Papam

A cross-platform JavaScript tool that provides information about the current Pope of the Catholic Church. It is available via CLI, npm package, and Chrome Extension.

[![npm](https://img.shields.io/npm/v/habemus-papam?color=blue)](https://www.npmjs.com/package/habemus-papam) [![MIT License](https://img.shields.io/badge/license-MIT-green)](https://github.com/viniciuspizettadesouza/habemus-papam/blob/main/license.md)

---

## ✝️ Overview

This monorepo delivers papal information across multiple environments:

- 📦 **NPM Package** – A reusable JavaScript library and CLI tool to access papal data programmatically.  
  👉 **[View on npm](https://www.npmjs.com/package/habemus-papam)**
- 🧩 **Chrome Extension** – A browser extension that displays current Pope information in real time.  
  👉 **[Install via Chrome Web Store](https://chromewebstore.google.com/detail/habemus-papam/ccmjegfeapjehgfmdckmmllgpblojboi)**

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

```
Habemus Papam!
Pope Leo XIV (Robert Francis Prevost) was elected on 2025-05-08.
Today is the election day of the current pope!
```

---

## 📚 Usage as a Library

```js
import { isElectionDayToday, getCurrentPope } from 'habemus-papam';

console.log(getCurrentPope());
console.log(isElectionDayToday());
```

---

## 🛠️ Developer Usage

### 🧩 Chrome Extension

📁 See: [`packages/extension/`](packages/extension/)

To load manually:

1. Go to `chrome://extensions/`
2. Enable Developer Mode
3. Load the folder: `packages/extension/`

To publish:

```bash
pnpm run zip-extension
```

This creates `habemus-papam-extension.zip` at the root.

### 🔃 Monorepo commands

Install dependencies:

```bash
pnpm install
```

#### ▶️ Run CLI locally (monorepo)

```bash
pnpm run start:cli
```

#### ✏️ Create a version bump:

```bash
pnpm changeset
```

#### 📄 Apply version and changelog:

```bash
pnpm run version-packages
```

#### 🚀 Publish to npm:

```bash
pnpm run release-packages
```

---

## 🗂️ Monorepo Structure

```bash
habemus-papam/
├── packages/
│   ├── core/         # CLI + npm package
│   └── extension/    # Chrome Extension
├── .changeset/       # Changeset files for versioning
├── pnpm-workspace.yaml
└── package.json      # Root workspace config + scripts
```

---

## 👤 Author

Vinicius Souza  
[https://github.com/viniciuspizettadesouza](https://github.com/viniciuspizettadesouza)

---

## 📄 License

[MIT](https://github.com/viniciuspizettadesouza/habemus-papam/blob/main/license.md)
