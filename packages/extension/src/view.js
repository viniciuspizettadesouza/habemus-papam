import { getCurrentPope, isElectionAnniversary } from "habemus-papam";

export function createPopupMarkup(date = new Date()) {
  const pope = getCurrentPope();

  return `
  <strong>Habemus Papam!</strong><br>
  ${pope.name} (${pope.birthName})<br>
  Elected on ${pope.elected}.<br>
  ${isElectionAnniversary(date) ? "<strong>🎉 Today is the election anniversary!</strong>" : ""}
`;
}

export function renderPopup(target, date = new Date()) {
  target.innerHTML = createPopupMarkup(date);
}
