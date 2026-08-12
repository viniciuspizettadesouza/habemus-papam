import { describe, expect, it } from "vitest";

import { runCli } from "../bin/commands.js";

const NOW = new Date(2026, 7, 13);

describe("CLI compatibility", () => {
  it("preserves the original no-argument output", () => {
    expect(runCli([], { now: NOW })).toEqual({
      output:
        "Habemus Papam!\n" +
        "Pope Leo XIV (Robert Francis Prevost) was elected on 2025-05-08.",
      error: "",
      exitCode: 0,
    });
  });

  it("preserves the election-day message", () => {
    expect(runCli([], { now: new Date(2025, 4, 8) }).output).toContain(
      "Today is the election day of the current pope!",
    );
  });
});

describe("CLI commands", () => {
  it("shows detailed current pope information", () => {
    const result = runCli(["current"], { now: NOW });

    expect(result.exitCode).toBe(0);
    expect(result.output).toContain("Pope Leo XIV");
    expect(result.output).toContain("Pontificate: 1 year, 3 months, 5 days");
    expect(result.output).toContain("Age: 70 years");
  });

  it("formats a zero-day pontificate on election day", () => {
    const result = runCli(["current"], { now: new Date(2025, 4, 8) });

    expect(result.output).toContain("Pontificate: 0 days");
  });

  it("shows the previous pope", () => {
    const result = runCli(["previous"], { now: NOW });

    expect(result.output).toContain("Pope Francis");
    expect(result.output).toContain("Pontificate ended: 2025-04-21");
  });

  it("lists history as text", () => {
    const result = runCli(["history"], { now: NOW });

    expect(result.output).toContain("Pope Leo XIV (2025-05-08 – present)");
    expect(result.output).toContain("Pope Paul VI");
  });

  it("finds a pope by a multi-word name", () => {
    const result = runCli(["pope", "John", "Paul", "II"], { now: NOW });

    expect(result.output).toContain("Pope John Paul II");
    expect(result.output).toContain("Karol Józef Wojtyła");
  });

  it("shows the next election anniversary", () => {
    const result = runCli(["anniversary"], { now: NOW });

    expect(result.output).toBe(
      "Pope Leo XIV\nNext election anniversary: 2027-05-08",
    );
  });

  it("shows help by command or option", () => {
    expect(runCli(["help"], { now: NOW }).output).toContain(
      "Usage: habemus-papam",
    );
    expect(runCli(["--help"], { now: NOW }).output).toContain("Commands:");
    expect(runCli(["-h"], { now: NOW }).exitCode).toBe(0);
  });
});

describe("CLI JSON output", () => {
  it("returns current pope data at the top level", () => {
    const data = JSON.parse(runCli(["--json"], { now: NOW }).output);

    expect(data.name).toBe("Pope Leo XIV");
    expect(data.pontificateDuration.totalDays).toBeGreaterThan(0);
    expect(data.nextElectionAnniversary).toBe("2027-05-08");
  });

  it("supports JSON for every data command", () => {
    const current = JSON.parse(
      runCli(["current", "--json"], { now: NOW }).output,
    );
    const previous = JSON.parse(
      runCli(["previous", "--json"], { now: NOW }).output,
    );
    const history = JSON.parse(
      runCli(["history", "--json"], { now: NOW }).output,
    );
    const pope = JSON.parse(
      runCli(["pope", "Francis", "--json"], { now: NOW }).output,
    );
    const anniversary = JSON.parse(
      runCli(["anniversary", "--json"], { now: NOW }).output,
    );

    expect(current.id).toBe("leo-xiv");
    expect(previous.id).toBe("francis");
    expect(history).toHaveLength(6);
    expect(pope.birthName).toBe("Jorge Mario Bergoglio");
    expect(anniversary.nextElectionAnniversary).toBe("2027-05-08");
  });
});

describe("CLI errors", () => {
  it("rejects a missing pope name", () => {
    const result = runCli(["pope"], { now: NOW });

    expect(result.exitCode).toBe(1);
    expect(result.error).toContain("requires a name");
  });

  it("reports an unknown pope as JSON", () => {
    const result = runCli(["pope", "Unknown", "--json"], { now: NOW });

    expect(result.exitCode).toBe(1);
    expect(JSON.parse(result.error)).toEqual({
      error: 'No pope found for "Unknown".',
    });
  });

  it("rejects unknown commands and options", () => {
    expect(runCli(["unknown"], { now: NOW }).error).toContain(
      "Unknown command: unknown",
    );
    expect(runCli(["--unknown"], { now: NOW }).error).toContain(
      "Unknown option: --unknown",
    );
  });
});
