# Papal Data Sources

The bundled dataset currently covers six recent popes, from Paul VI through
Leo XIV. The records were verified on August 13, 2026 against primary sources
published by the Holy See.

## Sources by record

| Pope | Primary source |
| --- | --- |
| Leo XIV | [Biography of the Holy Father Leo XIV](https://www.vatican.va/content/leo-xiv/en/biography/documents/biografia_leone-xiv.html) |
| Francis | [Biography of the Holy Father Francis](https://www.vatican.va/content/francesco/en/biography/documents/papa-francesco-biografia-bergoglio.html) |
| Benedict XVI | [Official biography index](https://www.vatican.va/content/benedict-xvi/en/biography.index.html) and [biographical notes](https://www.vatican.va/content/benedict-xvi/en/biography/documents/hf_ben-xvi_bio_20050419_short-biography_old.html) |
| John Paul II | [Biographical profile of John Paul II](https://www.vatican.va/content/john-paul-ii/en/biografia/documents/hf_jp-ii_spe_20190722_biografia.html) |
| John Paul I | [Biography of John Paul I](https://www.vatican.va/content/john-paul-i/en/biography/documents/hf_jp-i_bio_01021997_biography.html) |
| Paul VI | [Biographical profile of Paul VI](https://www.vatican.va/content/paul-vi/en/biografia/documents/hf_p-vi_spe_20190722_biografia.html) |

## Data conventions

- Dates use the ISO `YYYY-MM-DD` format and the Gregorian calendar.
- `elected` is the conclave election date, not the later inauguration date.
- `pontificateEnd` is inclusive and follows the end date published by the Holy
  See. It is `null` for the current pope.
- A date between one pontificate ending and the next election represents a
  vacant see; `getPopeByDate()` returns `null` for that period.
- Records are ordered in reverse chronological order, with the current pope
  first.

The dataset should not be expanded without adding a primary source and tests
for the new pontificate boundaries.
