function isElectionDayToday() {
  const today = new Date();
  return today.getDate() === 8 && today.getMonth() === 4 && today.getFullYear() === 2025;
}

function getCurrentPope() {
  return {
    name: "Pope Leo XIV",
    birthName: "Robert Francis Prevost",
    elected: "2025-05-08"
  };
}

const pope = getCurrentPope();
const output = `
  <strong>Habemus Papam!</strong><br>
  ${pope.name} (${pope.birthName})<br>
  Elected on ${pope.elected}.<br>
  ${isElectionDayToday() ? "<strong>🎉 Today is the election anniversary!</strong>" : ""}
`;

document.getElementById('output').innerHTML = output;
