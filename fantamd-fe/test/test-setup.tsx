import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

vi.mock("next/font/google", () => {
  const makeFont =
    (name: string) =>
    (options?: { subsets?: string[]; variable?: string }) => ({
      className: `mocked-${name}`,
      variable: options?.variable ?? "",
    });

  return {
    Inter: makeFont("inter"),
    Fira_Code: makeFont("fira-code"),
  };
});

vi.mock("@/app/providers", () => ({
  Providers: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.stubGlobal("fetch", vi.fn());

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
