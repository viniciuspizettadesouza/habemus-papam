import {
  getCurrentPope,
  getNextElectionAnniversary,
  getPopeAge,
  getPontificateDuration,
  isElectionAnniversary,
  listPopes,
} from "habemus-papam";

function pluralize(value, unit) {
  return `${value} ${unit}${value === 1 ? "" : "s"}`;
}

function formatDuration(duration) {
  const parts = [
    [duration.years, "year"],
    [duration.months, "month"],
    [duration.days, "day"],
  ]
    .filter(([value]) => value > 0)
    .map(([value, unit]) => pluralize(value, unit));

  return parts.length > 0 ? parts.join(", ") : "0 days";
}

export function createPopupMarkup(date = new Date()) {
  const pope = getCurrentPope();
  const age = getPopeAge(pope, date);
  const duration = getPontificateDuration(pope, date);
  const nextAnniversary = getNextElectionAnniversary(pope, date);
  const recentPopes = listPopes().slice(1, 4);

  return `
  <header>
    <p class="eyebrow">Habemus Papam!</p>
    <h1>${pope.name}</h1>
    <p class="birth-name">${pope.birthName}</p>
  </header>
  ${isElectionAnniversary(date) ? '<p class="celebration">🎉 Today is the election anniversary!</p>' : ""}
  <dl class="facts">
    <div><dt>Elected</dt><dd><time datetime="${pope.elected}">${pope.elected}</time></dd></div>
    <div><dt>Age</dt><dd>${pluralize(age, "year")}</dd></div>
    <div><dt>Pontificate</dt><dd>${formatDuration(duration)}</dd></div>
    <div><dt>Next anniversary</dt><dd><time datetime="${nextAnniversary}">${nextAnniversary}</time></dd></div>
  </dl>
  <section aria-labelledby="recent-popes-heading">
    <h2 id="recent-popes-heading">Recent popes</h2>
    <ul class="history">
      ${recentPopes.map((previous) => `<li><span>${previous.name}</span><small>${previous.elected}–${previous.pontificateEnd}</small></li>`).join("")}
    </ul>
  </section>
`;
}

export function renderPopup(target, date = new Date()) {
  target.innerHTML = createPopupMarkup(date);
}
