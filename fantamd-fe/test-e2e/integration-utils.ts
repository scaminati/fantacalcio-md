import { expect, Page } from "@playwright/test";

export async function performLogin(page: Page) {
  await page.getByRole("textbox", { name: /username/i }).fill("admin");
  await page.getByRole("textbox", { name: /password/i }).fill("admin");
  await page.getByRole("button", { name: /accedi/i }).click();
  await expect(page).toHaveURL(/\/$/);
}

export async function performLogout(page: Page) {
  await page.getByRole("button", { name: /esci/i }).click();
  await expect(page).toHaveURL(/\/login$/);
}
