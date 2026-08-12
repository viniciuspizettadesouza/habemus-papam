import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getCurrentPope,
  isElectionAnniversary,
  isElectionDay,
  isElectionDayToday,
} from "../src/index.js";

describe("getCurrentPope", () => {
  it("returns Pope Leo XIV", () => {
    expect(getCurrentPope()).toEqual({
      name: "Pope Leo XIV",
      birthName: "Robert Francis Prevost",
      elected: "2025-05-08",
    });
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
