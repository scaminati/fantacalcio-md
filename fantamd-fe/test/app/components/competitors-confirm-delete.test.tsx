import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { addToast } from "@heroui/toast";

import CompetitorsTable from "@/app/components/competitors-table";
import { deleteCompetitor } from "@/app/actions/competitors";
import {
  competitorMock,
  competitorsResult,
  networkErrorResult,
  generateCompetitorsPage,
} from "@/test/test-utils";
import CompetitorConfirmDelete from "@/app/components/competitors-confirm-delete";
import { renderWithAdapter } from "@/test/custom-renders";
import CompetitorsMobileList from "@/app/components/competitors-mobile-list";

const pageLimit = 15;
const totalValues = 16;

vi.mock("@/app/actions/competitors", () => ({
  deleteCompetitor: vi.fn(),
}));

vi.mock("@heroui/toast", () => ({
  addToast: vi.fn(),
}));

const getBodyRows = () => {
  const table = screen.getByTestId("competitors-table");
  const allRows = within(table).getAllByRole("row");

  return allRows.filter((row) => row.closest("tbody"));
};

const getCardRows = () => screen.getAllByTestId("competitor-card");

const deleteAction = async (getElementsFn: () => Array<HTMLElement>) => {
  await waitFor(() => {
    fireEvent.click(within(getElementsFn()[0]).getByTestId("actions-btn"));
    fireEvent.click(screen.getByTestId("delete-btn"));
  });

  await waitFor(() => {
    expect(screen.getByRole("dialog")).toBeDefined();
    fireEvent.click(screen.getByRole("button", { name: /conferma/i }));
  });

  await waitFor(() => {
    expect(screen.queryByRole("dialog")).toBeNull();
  });
};

const testDeleteCompetitorAndReload = async (
  ComponentToRender: React.ComponentType,
  getElementsFn: () => Array<HTMLElement>,
) => {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok: true,
    json: async () => competitorsResult,
  } as Response);
  vi.mocked(deleteCompetitor).mockResolvedValueOnce({});

  renderWithAdapter(<ComponentToRender />);

  await deleteAction(getElementsFn);

  expect(deleteCompetitor).toHaveBeenCalledExactlyOnceWith(
    expect.objectContaining({
      id: competitorsResult.results[0].id,
    }),
  );
  expect(fetch).toHaveBeenCalledTimes(2);
};

const testDeleteAndReloadFirstPage = async (
  ComponentToRender: React.ComponentType,
  getElementsFn: () => Array<HTMLElement>,
) => {
  vi.mocked(fetch).mockResolvedValueOnce({
    ok: true,
    json: async () => generateCompetitorsPage(1, totalValues, pageLimit),
  } as Response);
  vi.mocked(deleteCompetitor).mockResolvedValueOnce({});

  renderWithAdapter(<ComponentToRender />);

  await screen.findByTestId("pagination");

  vi.mocked(fetch).mockResolvedValueOnce({
    ok: true,
    json: async () => generateCompetitorsPage(2, totalValues, pageLimit),
  } as Response);

  fireEvent.click(
    within(screen.getByTestId("pagination")).getByRole("button", {
      name: /2/,
    }),
  );

  await waitFor(() => {
    expect(getElementsFn()).toHaveLength(totalValues - pageLimit);
  });

  vi.mocked(fetch).mockResolvedValueOnce({
    ok: true,
    json: async () => generateCompetitorsPage(1, totalValues - 1, pageLimit),
  } as Response);

  await deleteAction(getElementsFn);

  expect(fetch).toHaveBeenCalledWith(
    `/api/competitors?page=1&limit=${pageLimit}&search=`,
  );
  expect(fetch).toHaveBeenCalledTimes(3);
};

describe("Competitors delete component on table page", () => {
  test("Should delete competitor successfully and reload", async () => {
    await testDeleteCompetitorAndReload(CompetitorsTable, getBodyRows);
  });

  test("Should delete competitor second page row successfully and set previous page", async () => {
    await testDeleteAndReloadFirstPage(CompetitorsTable, getBodyRows);
  });
});

describe("Competitors delete component on mobile list", () => {
  test("Should delete competitor successfully and reload", async () => {
    await testDeleteCompetitorAndReload(CompetitorsMobileList, getCardRows);
  });

  test("Should delete competitor second page row successfully and set previous page", async () => {
    await testDeleteAndReloadFirstPage(CompetitorsMobileList, getCardRows);
  });
});

describe("Competitors delete component", () => {
  test("Should render toast with error on delete api", async () => {
    vi.mocked(deleteCompetitor).mockResolvedValueOnce(networkErrorResult);

    renderWithAdapter(
      <CompetitorConfirmDelete
        competitor={competitorMock}
        onCloseEvent={vi.fn()}
        onDeleteEvent={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /conferma/i }));
    await waitFor(() => {
      expect(addToast).toHaveBeenCalledWith({
        title: "Network error",
        color: "danger",
      });
    });
  });

  test("Should render toast with uncatch error on delete api", async () => {
    vi.mocked(deleteCompetitor).mockImplementationOnce(() => {
      throw new Error("Generic error");
    });

    renderWithAdapter(
      <CompetitorConfirmDelete
        competitor={competitorMock}
        onCloseEvent={vi.fn()}
        onDeleteEvent={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /conferma/i }));
    await waitFor(() => {
      expect(addToast).toHaveBeenCalledWith({
        title: "Errore nella comunicazione",
        color: "danger",
      });
    });
  });
});
