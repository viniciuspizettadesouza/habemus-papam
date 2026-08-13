import { describe, expect, it } from "vitest";

import { getCurrentPope } from "habemus-papam";

describe("package exports", () => {
  it("resolves the public package root", () => {
    expect(getCurrentPope().id).toBe("leo-xiv");
  });
});
