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
│   │   └── README.md (for npm site)
│   └── extension/    # Chrome Extension
│       ├── popup.js/html
│       ├── manifest.json
│       └── assets
├── pnpm-workspace.yaml
├── package.json (with zip-extension script)
├── README.md (this file)
└── privacy-policy.md
```

---

## 🚀 Development

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
# or
node packages/core/bin/cli.js
```

---

## 🚀 Publishing

### Publish the NPM Package

```bash
cd packages/core
pnpm publish --access public
```

Make sure you’re logged in with `npm login`.

### Publish the Chrome Extension

```bash
pnpm run zip-extension
```

Then go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole) and upload `habemus-papam-extension.zip`.

---

## 👤 Author

Vinicius Souza  
[github.com/viniciuspizettadesouza](https://github.com/viniciuspizettadesouza)

---

## 📄 License

[MIT](LICENSE)
