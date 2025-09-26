import { test, expect } from "@playwright/test";

import { performLogin, performLogout } from "./integration-utils";

test.describe("Web app base operations", () => {
  test("Open web root and redirect to login page", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("Perform login successfully and then logout", async ({ page }) => {
    await page.goto("/");

    await performLogin(page);
    await performLogout(page);
  });
});
