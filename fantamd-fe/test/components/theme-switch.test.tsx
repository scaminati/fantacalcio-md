import { describe, expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

import { ThemeSwitch } from "@/components/theme-switch";

describe("ThemeSwitch component", () => {
  test("Render button and swith to dark theme", async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="light">
        <ThemeSwitch />
      </ThemeProvider>,
    );

    expect(await screen.findByTestId("moon-icon")).toBeDefined();

    fireEvent.click(await screen.findByTestId("switch-btn"));

    expect(await screen.findByTestId("sun-icon")).toBeDefined();
  });

  test("Render button and swith to light theme", async () => {
    render(
      <ThemeProvider attribute="class" defaultTheme="dark">
        <ThemeSwitch classNames={{ label: "test" }} />
      </ThemeProvider>,
    );

    expect(await screen.findByTestId("sun-icon")).toBeDefined();

    fireEvent.click(await screen.findByTestId("switch-btn"));

    expect(await screen.findByTestId("moon-icon")).toBeDefined();
  });
});
