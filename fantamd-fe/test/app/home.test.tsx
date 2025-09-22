import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Icons } from "next/dist/lib/metadata/types/metadata-types";

import RootLayout, { metadata, viewport } from "@/app/layout";
import Home from "@/app/page";
import Error from "@/app/error";

vi.mock("@/lib/session", () => ({
  isAuthenticated: vi.fn().mockResolvedValue(true),
}));

describe("Home page component", () => {
  test("Should render login layout with child", () => {
    const rootLayout = RootLayout({
      children: <span>Test layout component</span>,
    });

    expect(rootLayout).toBeDefined();
  });

  test("Should render login page", () => {
    render(<Home />);
    expect(screen.getByTestId("competitors-table")).toBeDefined();
  });

  test("Should render error page and press reset", () => {
    const err = new global.Error("Error");
    const resetMock = vi.fn();

    render(<Error error={err} reset={resetMock} />);
    expect(
      screen.getByRole("heading", { name: /something went wrong!/i }),
    ).toBeDefined();

    const btn = screen.getByRole("button", { name: /try again/i });

    fireEvent.click(btn);
    expect(resetMock).toHaveBeenCalledOnce();
  });

  test("metadata: icona e title template", () => {
    const icons = metadata.icons as Icons;

    expect(icons.icon).toBe("/favicon.ico");
    expect(metadata.title).toMatchObject({
      template: expect.stringContaining("%s - "),
    });
  });

  test("viewport: themeColor impostato", () => {
    expect(viewport.themeColor).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ color: "white" }),
        expect.objectContaining({ color: "black" }),
      ]),
    );
  });
});
