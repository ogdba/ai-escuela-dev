import { describe, expect, it } from "vitest";
import { cn } from "@/lib/utils";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", false, "b", undefined, "c")).toBe("a b c");
  });

  it("returns empty string when nothing is truthy", () => {
    expect(cn("", false, undefined, null)).toBe("");
  });
});
