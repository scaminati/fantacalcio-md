import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

vi.mock("@/lib/session", () => ({
  isAuthenticated: vi.fn(),
  deleteSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});
