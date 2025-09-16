import { expect, test } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { ThemeProvider } from "next-themes";

import { ThemeSwitch } from "@/components/theme-switch";

test("ThemeSwitch component", async () => {
  render(
    <ThemeProvider attribute="class" defaultTheme="light">
      <ThemeSwitch />
    </ThemeProvider>,
  );

  expect(await screen.findByTestId("moon-icon")).toBeDefined();

  fireEvent.click(await screen.findByTestId("switch-btn"));

  expect(await screen.findByTestId("sun-icon")).toBeDefined();
});
