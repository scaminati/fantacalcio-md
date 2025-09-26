import { test, expect, Page } from "@playwright/test";

import { performLogin } from "./integration-utils";

test.describe("Competitor CRUD operations", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await performLogin(page);

    // delete all table rows if exists
    while ((await page.getByRole("rowheader").count()) > 0) {
      await performDeleteCompetitor(page, true);
    }
  });

  test("Open application and show current empty competitor table", async ({
    page,
  }) => {
    const emptyMsg = page.getByRole("gridcell", {
      name: "Nessun partecipante trovato",
    });

    expect(emptyMsg).toBeDefined();
  });

  test("Perform crud operation on competitor table", async ({ page }) => {
    await performAddCompetitor(page);
    await performEditCompetitor(page);
    await performDeleteCompetitor(page);
  });
});

async function performAddCompetitor(page: Page) {
  await page.getByRole("button", { name: "Aggiungi" }).click();

  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByRole("textbox", { name: "Nome*" }).fill("prova");
  await page.getByRole("textbox", { name: "Email*" }).fill("prova@email.com");
  await page.getByRole("textbox", { name: "Telefono*" }).fill("333333333");
  await page.getByRole("textbox", { name: "Pagato*" }).fill("si");
  await page.getByRole("checkbox", { name: "Aggiunto in APP" }).check();
  await page.getByRole("button", { name: "Salva" }).click();

  await expect(page.getByRole("dialog")).toBeHidden();
}

async function performEditCompetitor(page: Page) {
  await page.getByTestId("actions-btn").first().click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("dialog").getByText("Modifica").click();

  await page.getByRole("textbox", { name: "Nome*" }).fill("nuovo nome");
  await page
    .getByRole("textbox", { name: "Email*" })
    .fill("modifica@email.com");
  await page.getByRole("textbox", { name: "Telefono*" }).fill("222222222");
  await page.getByRole("textbox", { name: "Pagato*" }).fill("bonifico");
  await page.getByRole("checkbox", { name: "Aggiunto in APP" }).check();
  await page.getByRole("button", { name: "Salva" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();

  const firstRow = page.getByRole("rowheader").first();

  expect(firstRow.getByTestId("user").getByText("nuovo nome")).toBeDefined();
  expect(
    firstRow.getByTestId("user").getByText("modifica@email.com"),
  ).toBeDefined();
  expect(firstRow.getByText("222222222")).toBeDefined();
  expect(firstRow.getByTestId("paid").getByText("bonifico")).toBeDefined();
  expect(firstRow.getByTestId("added-chip").getByText("no")).toBeDefined();
}

async function performDeleteCompetitor(
  page: Page,
  skipEmptyCheck: boolean = false,
) {
  await page.getByTestId("actions-btn").first().click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("dialog").getByText("Elimina").click();

  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Conferma" }).click();
  await expect(page.getByRole("dialog")).toBeHidden();

  if (!skipEmptyCheck) {
    await expect(
      page.getByRole("gridcell", {
        name: "Nessun partecipante trovato",
      }),
    ).toBeVisible();
  }
}
