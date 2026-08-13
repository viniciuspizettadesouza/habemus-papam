import { afterEach, describe, expect, it, vi } from "vitest";

import {
  daysSinceElection,
  getAveragePontificateDuration,
  getCurrentPope,
  getLongestPontificate,
  getNextElectionAnniversary,
  getPopeByDate,
  getPopeByName,
  getPopeAge,
  getPontificateDuration,
  getPreviousPope,
  getShortestPontificate,
  isElectionAnniversary,
  isElectionDay,
  isElectionDayToday,
  listPopes,
} from "../src/index.ts";

describe("getCurrentPope", () => {
  it("returns Pope Leo XIV", () => {
    expect(getCurrentPope()).toMatchObject({
      name: "Pope Leo XIV",
      birthName: "Robert Francis Prevost",
      elected: "2025-05-08",
    });
  });

  it("does not expose mutable internal data", () => {
    const pope = getCurrentPope();
    pope.name = "Changed by a consumer";

    expect(getCurrentPope().name).toBe("Pope Leo XIV");
  });
});

describe("pope history", () => {
  it("returns the previous pope", () => {
    expect(getPreviousPope()).toMatchObject({
      id: "francis",
      name: "Pope Francis",
      pontificateEnd: "2025-04-21",
    });
  });

  it("lists popes in reverse chronological order", () => {
    const history = listPopes();

    expect(history).toHaveLength(6);
    expect(history.map((pope) => pope.id)).toEqual([
      "leo-xiv",
      "francis",
      "benedict-xvi",
      "john-paul-ii",
      "john-paul-i",
      "paul-vi",
    ]);
  });

  it("does not expose mutable history records", () => {
    const history = listPopes();
    history[1].name = "Changed by a consumer";

    expect(getPreviousPope().name).toBe("Pope Francis");
  });
});

describe("getPopeByName", () => {
  it("finds a pope without requiring the Pope title", () => {
    expect(getPopeByName("francis")?.birthName).toBe("Jorge Mario Bergoglio");
  });

  it("matches identifiers and birth names", () => {
    expect(getPopeByName("john-paul-ii")?.name).toBe("Pope John Paul II");
    expect(getPopeByName("Karol Jozef Wojtyla")?.id).toBe("john-paul-ii");
  });

  it("returns null when no pope matches", () => {
    expect(getPopeByName("Unknown")).toBeNull();
  });

  it("rejects an empty or non-string name", () => {
    expect(() => getPopeByName(" ")).toThrow(TypeError);
    expect(() => getPopeByName(null)).toThrow(TypeError);
  });
});

describe("getPopeByDate", () => {
  it("finds the pope serving on an ISO date", () => {
    expect(getPopeByDate("2015-01-01")?.name).toBe("Pope Francis");
  });

  it("accepts a Date using its local calendar date", () => {
    expect(getPopeByDate(new Date(2005, 3, 19))?.name).toBe(
      "Pope Benedict XVI",
    );
  });

  it("includes both pontificate boundaries", () => {
    expect(getPopeByDate("1978-08-26")?.name).toBe("Pope John Paul I");
    expect(getPopeByDate("1978-09-28")?.name).toBe("Pope John Paul I");
  });

  it("returns null during a vacant see", () => {
    expect(getPopeByDate("2025-04-22")).toBeNull();
  });

  it("returns null before the available history", () => {
    expect(getPopeByDate("1900-01-01")).toBeNull();
  });

  it("rejects invalid dates", () => {
    expect(() => getPopeByDate("2025-02-30")).toThrow(TypeError);
    expect(() => getPopeByDate(new Date("invalid"))).toThrow(TypeError);
    expect(() => getPopeByDate(20250508)).toThrow(TypeError);
  });
});

describe("getPontificateDuration", () => {
  it("returns calendar parts and total elapsed days", () => {
    expect(getPontificateDuration(getCurrentPope(), "2026-08-08")).toEqual({
      years: 1,
      months: 3,
      days: 0,
      totalDays: 457,
    });
  });

  it("stops at the end of a completed pontificate", () => {
    const francis = getPopeByName("Francis");

    expect(getPontificateDuration(francis, "2026-08-08")).toEqual({
      years: 12,
      months: 1,
      days: 8,
      totalDays: 4422,
    });
  });

  it("handles a reference day before the election day-of-month", () => {
    const johnPaulII = getPopeByName("John Paul II");

    expect(getPontificateDuration(johnPaulII, "2005-04-02")).toMatchObject({
      years: 26,
      months: 5,
      days: 17,
    });
  });

  it("rejects dates before the election and invalid records", () => {
    expect(() =>
      getPontificateDuration(getCurrentPope(), "2025-05-07"),
    ).toThrow(RangeError);
    expect(() => getPontificateDuration(null, "2025-05-08")).toThrow(TypeError);
    expect(() =>
      getPontificateDuration(
        { elected: "2025-05-08", pontificateEnd: "invalid" },
        "2025-05-08",
      ),
    ).toThrow(TypeError);
    expect(() =>
      getPontificateDuration(
        { elected: "2025-05-08", pontificateEnd: "2025-05-07" },
        "2025-05-08",
      ),
    ).toThrow(RangeError);
  });
});

describe("getPopeAge", () => {
  it("uses completed calendar years", () => {
    const leo = getCurrentPope();

    expect(getPopeAge(leo, "2026-09-13")).toBe(70);
    expect(getPopeAge(leo, "2026-09-14")).toBe(71);
  });

  it("handles a leap-day birth date", () => {
    const pope = {
      elected: "2020-01-01",
      pontificateEnd: null,
      birthDate: "2000-02-29",
    };

    expect(getPopeAge(pope, "2001-02-28")).toBe(1);
  });

  it("rejects dates before birth and records without a birth date", () => {
    expect(() => getPopeAge(getCurrentPope(), "1955-09-13")).toThrow(
      RangeError,
    );
    expect(() =>
      getPopeAge({ elected: "2025-05-08", pontificateEnd: null }, "2025-05-08"),
    ).toThrow(TypeError);
  });
});

describe("getNextElectionAnniversary", () => {
  it("returns the upcoming anniversary", () => {
    const leo = getCurrentPope();

    expect(getNextElectionAnniversary(leo, "2026-05-07")).toBe("2026-05-08");
  });

  it("moves to the following year when called on the anniversary", () => {
    expect(getNextElectionAnniversary(getCurrentPope(), "2026-05-08")).toBe(
      "2027-05-08",
    );
  });

  it("returns the election date when the reference predates the election", () => {
    expect(getNextElectionAnniversary(getCurrentPope(), "2025-01-01")).toBe(
      "2025-05-08",
    );
  });
});

describe("daysSinceElection", () => {
  it("counts elapsed calendar days from zero", () => {
    const leo = getCurrentPope();

    expect(daysSinceElection(leo, "2025-05-08")).toBe(0);
    expect(daysSinceElection(leo, "2025-05-09")).toBe(1);
  });

  it("rejects dates before the election", () => {
    expect(() => daysSinceElection(getCurrentPope(), "2025-05-07")).toThrow(
      RangeError,
    );
  });
});

describe("pontificate statistics", () => {
  it("returns the longest completed pontificate", () => {
    expect(getLongestPontificate()).toEqual({
      pope: expect.objectContaining({
        id: "john-paul-ii",
        name: "Pope John Paul II",
      }),
      duration: {
        years: 26,
        months: 5,
        days: 17,
        totalDays: 9665,
      },
    });
  });

  it("returns the shortest completed pontificate", () => {
    expect(getShortestPontificate()).toEqual({
      pope: expect.objectContaining({
        id: "john-paul-i",
        name: "Pope John Paul I",
      }),
      duration: {
        years: 0,
        months: 1,
        days: 2,
        totalDays: 33,
      },
    });
  });

  it("returns the rounded average and completed sample size", () => {
    expect(getAveragePontificateDuration()).toEqual({
      averageDays: 4503,
      sampleSize: 5,
    });
  });

  it("does not expose mutable internal records", () => {
    const result = getLongestPontificate();
    result.pope.name = "Changed by a consumer";
    result.duration.totalDays = 0;

    expect(getLongestPontificate().pope.name).toBe("Pope John Paul II");
    expect(getLongestPontificate().duration.totalDays).toBe(9665);
  });
});

describe("isElectionDay", () => {
  it("returns true on May 8, 2025", () => {
    expect(isElectionDay(new Date(2025, 4, 8))).toBe(true);
  });

  it("returns false on May 8, 2026", () => {
    expect(isElectionDay(new Date(2026, 4, 8))).toBe(false);
  });

  it("returns false on a different day", () => {
    expect(isElectionDay(new Date(2025, 4, 9))).toBe(false);
  });

  it("rejects invalid input", () => {
    expect(() => isElectionDay(new Date("invalid"))).toThrow(TypeError);
    expect(() => isElectionDay("2025-05-08")).toThrow(TypeError);
  });
});

describe("isElectionAnniversary", () => {
  it("returns true on the election date", () => {
    expect(isElectionAnniversary(new Date(2025, 4, 8))).toBe(true);
  });

  it("returns true on May 8 in a later year", () => {
    expect(isElectionAnniversary(new Date(2026, 4, 8))).toBe(true);
  });

  it("returns false before the election took place", () => {
    expect(isElectionAnniversary(new Date(2024, 4, 8))).toBe(false);
  });

  it("returns false on a different day", () => {
    expect(isElectionAnniversary(new Date(2026, 4, 9))).toBe(false);
  });

  it("rejects invalid input", () => {
    expect(() => isElectionAnniversary(new Date("invalid"))).toThrow(TypeError);
  });
});

describe("isElectionDayToday", () => {
  it("remains a backward-compatible alias for isElectionDay", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 4, 8));

    expect(isElectionDayToday()).toBe(true);
  });
});

afterEach(() => {
  vi.useRealTimers();
});
