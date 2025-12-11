import { describe, expect, test, vi } from "vitest";
import { fireEvent, screen, waitFor, within } from "@testing-library/dom";

import { renderWithAdapter } from "@/test/custom-renders";
import CompetitorsMobileList from "@/app/components/competitors-mobile-list";
import {
  competitorMock,
  competitorsResult,
  emptyCompetitorsResult,
} from "@/test/test-utils";
import { saveCompetitor } from "@/app/actions/competitors";

vi.mock("@/app/actions/competitors", () => ({
  saveCompetitor: vi.fn(),
}));

describe("Competitors mobile list component", () => {
  test("Should render competitor mobile list component", () => {
    renderWithAdapter(<CompetitorsMobileList />);
    expect(screen.getByTestId("competitors-mobile-list")).toBeDefined();
  });

  test("Should render empty message if no competitors exists ", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => emptyCompetitorsResult,
    } as Response);
    renderWithAdapter(<CompetitorsMobileList />);
    await waitFor(() => {
      expect(screen.getByText("Nessun partecipante trovato")).toBeDefined();
    });
  });

  test("Should render empty message if api don't return results data", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        total: 0,
        results: undefined,
      }),
    } as Response);
    renderWithAdapter(<CompetitorsMobileList />);
    await waitFor(() => {
      expect(screen.getByText("Nessun partecipante trovato")).toBeDefined();
    });
  });

  test("Should render first page with competitors", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => competitorsResult,
    } as Response);
    renderWithAdapter(<CompetitorsMobileList />);
    expect(screen.getAllByTestId("competitor-skeleton").length).toBeGreaterThan(
      0,
    );
    await waitFor(() => {
      expect(screen.getByTestId("total-count").textContent).toBe(
        `${competitorsResult.total}`,
      );
      expect(screen.getAllByTestId("competitor-card")).toHaveLength(
        competitorsResult.results.length,
      );
    });
  });

  test("Should reload competitors when filter change", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => competitorsResult,
    } as Response);

    renderWithAdapter(<CompetitorsMobileList />);

    // table without search
    await waitFor(() => {
      expect(screen.getAllByTestId("competitor-card")).toHaveLength(
        competitorsResult.results.length,
      );
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

    expect(screen.getAllByTestId("competitor-skeleton").length).toBeGreaterThan(
      0,
    );
    expect(
      await screen.findByText("Nessun partecipante trovato"),
    ).toBeDefined();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("Should reload table after search button click with empty value", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => emptyCompetitorsResult,
    } as Response);

    renderWithAdapter(<CompetitorsMobileList />);
    fireEvent.click(screen.getByTestId("search-icon"));
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(2);
    });
  });

});
