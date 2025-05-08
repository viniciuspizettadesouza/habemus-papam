export function isElectionDayToday() {
  const today = new Date();
  return today.getDate() === 8 && today.getMonth() === 4 && today.getFullYear() === 2025;
}

export function getCurrentPope() {
  return {
    name: "Pope Leo XIV",
    birthName: "Robert Francis Prevost",
    elected: "2025-05-08",
  };
}
