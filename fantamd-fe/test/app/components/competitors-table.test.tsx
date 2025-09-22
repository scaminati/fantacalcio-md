import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { addToast } from "@heroui/toast";

import CompetitorsTable from "@/app/components/competitors-table";
import { getCompetitors } from "@/app/actions/competitors";
import {
  competitorsResult,
  emptyCompetitorsResult,
  networkErrorResult,
  generateCompetitorsPage,
} from "@/test/test-utils";

const pageLimit = 15;
const totalValues = 20;

vi.mock("@/app/actions/competitors", () => ({
  getCompetitors: vi.fn(),
}));

vi.mock("@heroui/toast", () => ({
  addToast: vi.fn(),
}));

const getBodyRows = () => {
  const table = screen.getByTestId("competitors-table");
  const allRows = within(table).getAllByRole("row");

  return allRows.filter((row) => row.closest("tbody"));
};

describe("Competitors table component", () => {
  test("Should render competitor table component", () => {
    render(<CompetitorsTable />);
    expect(screen.getByTestId("competitors-table")).toBeDefined();
  });

  test("Should render empty table if no competitors exists ", async () => {
    vi.mocked(getCompetitors).mockResolvedValueOnce(emptyCompetitorsResult);

    render(<CompetitorsTable />);
    await waitFor(() => {
      expect(screen.getByText("Nessun partecipante trovato")).toBeDefined();
    });
  });

  test("Should render empty table if api don't return results data", async () => {
    vi.mocked(getCompetitors).mockResolvedValueOnce({
      data: {
        total: 0,
        results: undefined,
      },
    });

    render(<CompetitorsTable />);
    await waitFor(() => {
      expect(screen.getByText("Nessun partecipante trovato")).toBeDefined();
    });
  });

  test("Should render table first page with competitors", async () => {
    vi.mocked(getCompetitors).mockResolvedValueOnce(competitorsResult);

    render(<CompetitorsTable />);

    expect(screen.getByTestId("competitor-spinner")).toBeDefined();
    await waitFor(() => {
      const bodyRows = getBodyRows();

      expect(bodyRows).toHaveLength(competitorsResult.data!.total);

      const firstRow = bodyRows[0];
      const firstCompetitor = competitorsResult.data!.results![0];
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
      expect(getCompetitors).toHaveBeenCalledExactlyOnceWith(
        1,
        expect.anything(),
        "",
      );
    });
  });

  test("Should reload competitors when filter change", async () => {
    vi.mocked(getCompetitors).mockResolvedValueOnce(competitorsResult);

    render(<CompetitorsTable />);

    // table without search
    await waitFor(() => {
      expect(getBodyRows()).toHaveLength(competitorsResult.data!.total);
    });

    // after search with empty list
    vi.mocked(getCompetitors).mockResolvedValueOnce(emptyCompetitorsResult);
    fireEvent.change(screen.getByLabelText(/cerca.../i), {
      target: { value: "Name" },
    });
    fireEvent.click(screen.getByTestId("search-icon"));

    expect(screen.getByTestId("competitor-spinner")).toBeDefined();
    expect(
      await screen.findByText("Nessun partecipante trovato"),
    ).toBeDefined();
    expect(getCompetitors).toHaveBeenCalledTimes(2);
  });

  test("Should render first page and then switch to second page", async () => {
    vi.mocked(getCompetitors).mockResolvedValueOnce(
      generateCompetitorsPage(1, totalValues, pageLimit),
    );

    render(<CompetitorsTable />);

    // table first page
    await waitFor(() => {
      expect(getBodyRows()[0].getAttribute("data-key")).toBe("1");
      expect(getCompetitors).toHaveBeenCalledWith(1, expect.anything(), "");
    });

    vi.mocked(getCompetitors).mockResolvedValueOnce(
      generateCompetitorsPage(2, totalValues, pageLimit),
    );

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
      expect(getCompetitors).toHaveBeenCalledWith(1, expect.anything(), "");
    });
    expect(getCompetitors).toHaveBeenCalledTimes(2);
  });

  test("Should render empty table if api error occurs", async () => {
    vi.mocked(getCompetitors).mockResolvedValueOnce(networkErrorResult);

    render(<CompetitorsTable />);
    await waitFor(() => {
      expect(screen.getByText("Nessun partecipante trovato")).toBeDefined();
      expect(addToast).toHaveBeenCalledWith({
        title: "Network error",
        color: "danger",
      });
    });
  });

  test("Should reload table after search button click with empty value", async () => {
    vi.mocked(getCompetitors).mockResolvedValueOnce(emptyCompetitorsResult);

    render(<CompetitorsTable />);
    fireEvent.click(screen.getByTestId("search-icon"));
    expect(getCompetitors).toHaveBeenCalledTimes(2);
  });
});
