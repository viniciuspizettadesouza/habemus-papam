function isElectionAnniversary(date = new Date()) {
  return date.getDate() === 8 && date.getMonth() === 4;
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
  ${isElectionAnniversary() ? "<strong>🎉 Today is the election anniversary!</strong>" : ""}
`;

document.getElementById('output').innerHTML = output;
