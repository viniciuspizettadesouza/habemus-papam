const records = [
  {
    id: "leo-xiv",
    name: "Pope Leo XIV",
    birthName: "Robert Francis Prevost",
    birthDate: "1955-09-14",
    elected: "2025-05-08",
    pontificateEnd: null,
  },
  {
    id: "francis",
    name: "Pope Francis",
    birthName: "Jorge Mario Bergoglio",
    birthDate: "1936-12-17",
    elected: "2013-03-13",
    pontificateEnd: "2025-04-21",
  },
  {
    id: "benedict-xvi",
    name: "Pope Benedict XVI",
    birthName: "Joseph Ratzinger",
    birthDate: "1927-04-16",
    elected: "2005-04-19",
    pontificateEnd: "2013-02-28",
  },
  {
    id: "john-paul-ii",
    name: "Pope John Paul II",
    birthName: "Karol Józef Wojtyła",
    birthDate: "1920-05-18",
    elected: "1978-10-16",
    pontificateEnd: "2005-04-02",
  },
  {
    id: "john-paul-i",
    name: "Pope John Paul I",
    birthName: "Albino Luciani",
    birthDate: "1912-10-17",
    elected: "1978-08-26",
    pontificateEnd: "1978-09-28",
  },
  {
    id: "paul-vi",
    name: "Pope Paul VI",
    birthName: "Giovanni Battista Montini",
    birthDate: "1897-09-26",
    elected: "1963-06-21",
    pontificateEnd: "1978-08-06",
  },
];

export const popes = Object.freeze(records.map((pope) => Object.freeze(pope)));
export const currentPope = popes[0];
