# 📦 habemus-papam

> Returns information about the current Pope of the Catholic Church.

## 📥 Installation

```bash
pnpm add habemus-papam
# or
npm install habemus-papam
```

## 📚 Usage as a library

```js
import { isElectionDayToday, getCurrentPope } from 'habemus-papam';

console.log(getCurrentPope());
// { name: "Pope Leo XIV", birthName: "Robert Francis Prevost", elected: "2025-05-08" }

console.log(isElectionDayToday());
// true if today is 2025-05-08
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

## 👤 Author

Vinicius Souza  
[https://github.com/viniciuspizettadesouza](https://github.com/viniciuspizettadesouza)

## 📄 License

MIT
