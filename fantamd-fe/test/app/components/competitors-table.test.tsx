import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { addToast } from "@heroui/toast";

import CompetitorsTable from "@/app/components/competitors-table";
import {
  competitorsResult,
  emptyCompetitorsResult,
  networkErrorResult,
  generateCompetitorsPage,
} from "@/test/test-utils";
import { renderWithAdapter } from "@/test/custom-renders";

const pageLimit = 15;
const totalValues = 20;

vi.mock("@heroui/toast", () => ({
  addToast: vi.fn(),
}));

const getBodyRows = () => {
  const table = screen.getByTestId("competitors-table");
  const allRows = within(table).getAllByRole("row");

  return allRows.filter((row) => row.closest("tbody"));
};

const expectedFetchUrlRegex = (page: number, filterValue: string) =>
  new RegExp(
    `/api/competitors\\?page=${page}&limit=\\d+&search=${filterValue}`,
  );

describe("Competitors table component", () => {
  test("Should render competitor table component", () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => competitorsResult,
    } as Response);
    renderWithAdapter(<CompetitorsTable />);
    expect(screen.getByTestId("competitors-table")).toBeDefined();
  });

  test("Should render empty table if no competitors exists ", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => emptyCompetitorsResult,
    } as Response);
    renderWithAdapter(<CompetitorsTable />);
    await waitFor(() => {
      expect(screen.getByText("Nessun partecipante trovato")).toBeDefined();
    });
  });

  test("Should render empty table if api don't return results data", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        total: 0,
        results: undefined,
      }),
    } as Response);
    renderWithAdapter(<CompetitorsTable />);
    await waitFor(() => {
      expect(screen.getByText("Nessun partecipante trovato")).toBeDefined();
    });
  });

  test("Should render table first page with competitors", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => competitorsResult,
    } as Response);
    renderWithAdapter(<CompetitorsTable />);
    expect(screen.getByTestId("competitor-spinner")).toBeDefined();
    await waitFor(() => {
      const bodyRows = getBodyRows();

      expect(bodyRows).toHaveLength(competitorsResult.total);

      const firstRow = bodyRows[0];
      const firstCompetitor = competitorsResult.results![0];
      const firstChip =
        within(firstRow).getByTestId("added-chip").firstElementChild;
      const chipColor = firstCompetitor.added_into_app
        ? "bg-success"
        : "bg-danger";

      expect(
        within(firstRow).getByText(firstCompetitor.fullname),
      ).toBeDefined();
      expect(within(firstRow).getByText(firstCompetitor.email)).toBeDefined();
      expect(within(firstRow).getByText(firstCompetitor.phone)).toBeDefined();
      expect(firstChip!.classList.contains(chipColor)).toBeTruthy();
      expect(fetch).toHaveBeenCalledExactlyOnceWith(
        expect.stringMatching(expectedFetchUrlRegex(1, "")),
      );
    });
  });

  test("Should reload competitors when filter change", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => competitorsResult,
    } as Response);

    renderWithAdapter(<CompetitorsTable />);

    // table without search
    await waitFor(() => {
      expect(getBodyRows()).toHaveLength(competitorsResult.total);
    });

    // after search with empty list
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => emptyCompetitorsResult,
    } as Response);
    fireEvent.change(screen.getByLabelText(/cerca.../i), {
      target: { value: "Name" },
    });
    fireEvent.click(screen.getByTestId("search-icon"));

    expect(screen.getByTestId("competitor-spinner")).toBeDefined();
    expect(
      await screen.findByText("Nessun partecipante trovato"),
    ).toBeDefined();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("Should render first page and then switch to second page", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => generateCompetitorsPage(1, totalValues, pageLimit),
    } as Response);

    renderWithAdapter(<CompetitorsTable />);

    // table first page
    await waitFor(() => {
      expect(getBodyRows()[0].getAttribute("data-key")).toBe("1");
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(expectedFetchUrlRegex(1, "")),
      );
    });

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => generateCompetitorsPage(2, totalValues, pageLimit),
    } as Response);

    const pagination = screen.getByTestId("pagination");

    fireEvent.click(
      within(pagination).getByRole("button", {
        name: /2/,
      }),
    );

    expect(screen.getByTestId("competitor-spinner")).toBeDefined();

    // table first page
    await waitFor(() => {
      expect(getBodyRows()[0].getAttribute("data-key")).toBe("16");
      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(expectedFetchUrlRegex(1, "")),
      );
    });
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("Should render empty table if api error occurs", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => networkErrorResult,
    } as Response);

    renderWithAdapter(<CompetitorsTable />);
    await waitFor(() => {
      expect(screen.getByText("Nessun partecipante trovato")).toBeDefined();
      expect(addToast).toHaveBeenCalledWith({
        title: networkErrorResult.error,
        color: "danger",
      });
    });
  });

  test("Should reload table after search button click with empty value", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => emptyCompetitorsResult,
    } as Response);

    renderWithAdapter(<CompetitorsTable />);
    fireEvent.click(screen.getByTestId("search-icon"));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });
});
