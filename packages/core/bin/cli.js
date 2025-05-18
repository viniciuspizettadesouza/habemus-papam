#!/usr/bin/env node
import { isElectionDayToday, getCurrentPope } from '../src/index.js';

const pope = getCurrentPope();

console.log("Habemus Papam!");
console.log(`${pope.name} (${pope.birthName}) was elected on ${pope.elected}.`);
if (isElectionDayToday()) {
  console.log("Today is the election day of the current pope!");
}
