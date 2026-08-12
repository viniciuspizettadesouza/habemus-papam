import { describe, expect, it } from "vitest";

import { createPopupMarkup, renderPopup } from "../src/view.js";

describe("createPopupMarkup", () => {
  it("renders the current pope from the core package", () => {
    const markup = createPopupMarkup(new Date(2026, 4, 9));

    expect(markup).toContain("Pope Leo XIV (Robert Francis Prevost)");
    expect(markup).toContain("Elected on 2025-05-08.");
  });

  it("renders the election anniversary message on May 8", () => {
    const markup = createPopupMarkup(new Date(2026, 4, 8));

    expect(markup).toContain("Today is the election anniversary!");
  });

  it("omits the election anniversary message on other dates", () => {
    const markup = createPopupMarkup(new Date(2026, 4, 9));

    expect(markup).not.toContain("Today is the election anniversary!");
  });
});

describe("renderPopup", () => {
  it("writes the generated markup to the target element", () => {
    const target = { innerHTML: "" };

    renderPopup(target, new Date(2026, 4, 9));

    expect(target.innerHTML).toContain("Habemus Papam!");
    expect(target.innerHTML).toContain("Pope Leo XIV");
  });
});
