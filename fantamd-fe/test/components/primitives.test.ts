import { describe, it, expect } from "vitest";

import { subtitle, title } from "@/components/primitives";

describe("title variant generator", () => {
  it("should return default size class", () => {
    const result = title();

    expect(result).toContain("text-[2.3rem]");
    expect(result).toContain("lg:text-5xl");
  });

  it("should apply violet color gradient", () => {
    const result = title({ color: "violet" });

    expect(result).toContain("bg-clip-text");
    expect(result).toContain("text-transparent");
    expect(result).toContain("bg-gradient-to-b");
    expect(result).toContain("from-[#FF1CF7]");
    expect(result).toContain("to-[#b249f8]");
  });

  it("should apply fullWidth class", () => {
    const result = title({ fullWidth: true });

    expect(result).toContain("w-full");
    expect(result).toContain("block");
  });
});

describe("subtitle variant generator", () => {
  it("should return default fullWidth class", () => {
    const result = subtitle();

    expect(result).toContain("!w-full");
  });

  it("should apply base subtitle classes", () => {
    const result = subtitle();

    expect(result).toContain("text-lg");
    expect(result).toContain("text-default-600");
  });
});
