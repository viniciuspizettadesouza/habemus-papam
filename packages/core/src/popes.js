import { currentPope } from "./data/current-pope.js";

export function getCurrentPope() {
  return { ...currentPope };
}
