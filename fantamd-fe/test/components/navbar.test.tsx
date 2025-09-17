import { describe, expect, test, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { redirect } from "next/navigation";

import { Navbar } from "@/components/navbar";
import { isAuthenticated } from "@/lib/session";

vi.mock("@/lib/session", () => ({
  isAuthenticated: vi.fn(),
  deleteSession: vi.fn(),
}));

describe("Navbar component", () => {
  test("Show navbar when user is not autenticated", async () => {
    vi.mocked(isAuthenticated).mockResolvedValueOnce(false);

    render(await Navbar());

    expect(isAuthenticated).toHaveBeenCalledOnce();

    const appName = await screen.findByTestId("app-name");
    const logoutButton = screen.queryByTestId("logout-button");

    expect(appName.textContent).toBe("FANTAMD");
    expect(logoutButton).toBeNull();
  });

  test("Show navbar when user is autenticated", async () => {
    vi.mocked(isAuthenticated).mockResolvedValueOnce(true);

    render(await Navbar());

    expect(isAuthenticated).toHaveBeenCalledOnce();

    const appName = await screen.findByTestId("app-name");
    const logoutButton = await screen.findByTestId("logout-button");

    expect(appName.textContent).toBe("FANTAMD");
    expect(logoutButton).toBeDefined();
  });

  test("Perform logout after button click", async () => {
    vi.mocked(isAuthenticated).mockResolvedValueOnce(true);

    render(await Navbar());

    const logoutButton = await screen.findByTestId("logout-button");

    fireEvent.click(logoutButton);
    await waitFor(() => {
      expect(redirect).toHaveBeenCalledWith("/login");
    });
  });
});
