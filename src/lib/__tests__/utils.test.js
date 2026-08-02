import { cn } from "../utils";

describe("cn utility", () => {
  test("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  test("handles conditional classes", () => {
    expect(cn("base", true && "active", false && "hidden")).toBe("base active");
  });

  test("deduplicates conflicting tailwind classes", () => {
    expect(cn("px-4", "px-6")).toBe("px-6");
  });

  test("returns empty string for no arguments", () => {
    expect(cn()).toBe("");
  });

  test("handles undefined and null", () => {
    expect(cn("foo", undefined, null, "bar")).toBe("foo bar");
  });
});
