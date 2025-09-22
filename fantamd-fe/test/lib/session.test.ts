import { describe, expect, test, vi } from "vitest";

import {
  createSession,
  deleteSession,
  getToken,
  isAuthenticated,
  updateSession,
} from "@/lib/session";

const mockCookies = {
  get: vi.fn(),
  set: vi.fn(),
  delete: vi.fn(),
};

vi.mock("next/headers", () => ({
  cookies: () => mockCookies,
}));

describe("Session management", () => {
  test("Should create a session cookie", async () => {
    const mockSession = "test-session";

    await createSession(mockSession);
    expect(mockCookies.set).toHaveBeenCalledWith(
      "session",
      mockSession,
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      }),
    );
  });

  test("Should update session cookie if it exists", async () => {
    const existingSession = "existing-session";

    mockCookies.get.mockReturnValue({ value: existingSession });
    await updateSession();
    expect(mockCookies.set).toHaveBeenCalledWith(
      "session",
      existingSession,
      expect.objectContaining({
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
      }),
    );
  });

  test("Should not update session if it does not exist", async () => {
    mockCookies.get.mockReturnValue(undefined);

    const result = await updateSession();

    expect(result).toBeNull();
    expect(mockCookies.set).not.toHaveBeenCalled();
  });

  test("should delete session cookie", async () => {
    await deleteSession();
    expect(mockCookies.delete).toHaveBeenCalledWith("session");
  });

  test("should return true if session exists", async () => {
    mockCookies.get.mockReturnValue({ value: "session-token" });

    const result = await isAuthenticated();

    expect(result).toBe(true);
  });

  test("should return false if session does not exist", async () => {
    mockCookies.get.mockReturnValue(undefined);

    const result = await isAuthenticated();

    expect(result).toBe(false);
  });

  test("should return session token", async () => {
    const token = "token123";

    mockCookies.get.mockReturnValue({ value: token });
    const result = await getToken();

    expect(result).toBe(token);
  });
});
