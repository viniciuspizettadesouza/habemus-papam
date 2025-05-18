# Habemus Papam

> Information about the current Pope of the Catholic Church – available as an NPM package and a Chrome Extension.

---

## ✝️ Overview

This project contains two parts:

- 📦 **NPM Package (`habemus-papam`)** – Provides data about the current Pope via CLI or programmatic usage.
- 🧩 **Chrome Extension** – Displays Pope information directly in your browser.

---

## 📦 NPM Package

### Installation

```bash
pnpm add habemus-papam
# or
npm install habemus-papam
```

### Usage as a library

```js
import { isElectionDayToday, getCurrentPope } from 'habemus-papam';

console.log(getCurrentPope());
// { name: "Pope Leo XIV", birthName: "Robert Francis Prevost", elected: "2025-05-08" }

console.log(isElectionDayToday());
// true if today is 2025-05-08
```

### CLI Usage

```bash
npx habemus-papam
```

Output:
```
Habemus Papam!
Pope Leo XIV (Robert Francis Prevost) was elected on 2025-05-08.
Today is the election day of the current pope!
```

---

## 🧩 Chrome Extension

1. Go to `chrome://extensions/`
2. Enable **Developer Mode**
3. Click **Load unpacked**
4. Select the `packages/extension/` folder

📦 To publish to the Chrome Web Store:
- Zip the **contents** of the `packages/extension/` folder (not the folder itself)
- Upload it to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

Or use:

```bash
pnpm run zip-extension
```

This will generate `habemus-papam-extension.zip` in the root directory.

---

## 📁 Project Structure

```bash
habemus-papam/
├── packages/
│   ├── core/         # NPM package
│   │   ├── src/
│   │   ├── bin/
│   │   ├── package.json
│   │   └── README.md
│   └── extension/    # Chrome Extension
│       ├── popup.js/html
│       ├── manifest.json
│       └── assets
├── .changeset/
│   ├── config.json
│   └── *.md
├── pnpm-workspace.yaml
├── package.json (with publish/version scripts)
├── README.md (this file)
└── privacy-policy.md
```

---

## 🚀 Development & Versioning

### Requirements

- Node.js 18+
- pnpm `>=7`

### Setup

```bash
pnpm install
```

### Run CLI locally

```bash
pnpm --filter habemus-papam start
```

---

## 🚀 Publishing with Changesets

### Step 1: Create a changeset

```bash
pnpm changeset
```

Answer the prompts to choose the package and type of version bump (patch, minor, major).

### Step 2: Apply versions

```bash
pnpm run version-packages
```

This updates `package.json` versions and generates a `CHANGELOG.md`.

### Step 3: Publish updated packages

```bash
pnpm run release-packages
```

Only the packages with changesets will be published to npm.

---

## 👤 Author

Vinicius Souza  
[github.com/viniciuspizettadesouza](https://github.com/viniciuspizettadesouza)

---

## 📄 License

[MIT](LICENSE)
