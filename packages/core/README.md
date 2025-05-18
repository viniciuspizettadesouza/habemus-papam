# habemus-papam

A cross-platform JavaScript tool that provides information about the current Pope of the Catholic Church. This is the core CLI and library package from the monorepo.

## ✝️ About "Habemus Papam"

"Habemus Papam" means "We have a Pope."
It is the traditional announcement by the Cardinal Protodeacon from St. Peter's Basilica, marking the election of a new pope — a ritual dating back to the 15th century symbolizing continuity in the Catholic Church.

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

## 📚 Usage as a Library

```js
import { isElectionDayToday, getCurrentPope } from 'habemus-papam';

console.log(getCurrentPope());
console.log(isElectionDayToday());
```

## 🧩 Chrome Extension

This package is part of a monorepo that also includes a browser extension.  
🧩 [View on Chrome Web Store](https://chromewebstore.google.com/detail/habemus-papam/ccmjegfeapjehgfmdckmmllgpblojboi)

## 👤 Author

Vinicius Souza  
[https://github.com/viniciuspizettadesouza](https://github.com/viniciuspizettadesouza)


## 📄 License

Licensed under the [MIT License](https://github.com/viniciuspizettadesouza/habemus-papam/blob/main/license.md).
