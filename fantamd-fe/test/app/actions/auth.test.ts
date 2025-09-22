import { describe, expect, test, vi } from "vitest";
import { redirect } from "next/navigation";

import { login, logout } from "@/app/actions/auth";
import { createSession, deleteSession } from "@/lib/session";

vi.mock("@/lib/session", () => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

describe("Authentication actions", () => {
  test("Perform login action successfully", async () => {
    const loginResponse = { token: "token" };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => loginResponse,
    } as Response);
    vi.mocked(createSession).mockResolvedValue();
    const result = await login("username", "password");

    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      expect.anything(),
      expect.objectContaining({
        body: JSON.stringify({ username: "username", password: "password" }),
      }),
    );
    expect(createSession).toHaveBeenCalledOnce();
    expect(result.data).toBe(loginResponse);
  });

  test("Send error if login action fails", async () => {
    const errorResponse = "Auth error";

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: errorResponse,
      }),
    } as Response);
    const result = await login("username", "password");

    expect(fetch).toHaveBeenCalledOnce();
    expect(createSession).toHaveBeenCalledTimes(0);
    expect(result.error).toBe(errorResponse);
  });

  test("Perform logout action successfully", async () => {
    await logout();
    expect(deleteSession).toHaveBeenCalledOnce();
    expect(redirect).toHaveBeenCalledWith("/login");
  });
});
