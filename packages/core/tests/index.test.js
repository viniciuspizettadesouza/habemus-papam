import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getCurrentPope,
  getPopeByDate,
  getPopeByName,
  getPreviousPope,
  isElectionAnniversary,
  isElectionDay,
  isElectionDayToday,
  listPopes,
} from "../src/index.js";

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
