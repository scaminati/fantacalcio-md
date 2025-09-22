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
import { deleteCompetitor, getCompetitors } from "@/app/actions/competitors";
import {
  competitorMock,
  competitorsResult,
  networkErrorResult,
  generateCompetitorsPage,
} from "@/test/test-utils";
import CompetitorConfirmDelete from "@/app/components/competitors-confirm-delete";

const pageLimit = 15;
const totalValues = 16;

vi.mock("@/app/actions/competitors", () => ({
  getCompetitors: vi.fn(),
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

describe("Competitors delete component", () => {
  const deleteAction = async () => {
    await waitFor(() => {
      fireEvent.click(within(getBodyRows()[0]).getByTestId("actions-btn"));
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

  test("Should delete competitor successfully and reload", async () => {
    vi.mocked(getCompetitors).mockResolvedValueOnce(competitorsResult);
    vi.mocked(deleteCompetitor).mockResolvedValueOnce({});

    render(<CompetitorsTable />);

    await deleteAction();

    expect(deleteCompetitor).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        id: competitorsResult.data?.results[0].id,
      }),
    );
    expect(getCompetitors).toHaveBeenCalledTimes(2);
  });

  test("Should delete competitor second page row successfully and set previous page", async () => {
    vi.mocked(getCompetitors).mockResolvedValue(
      generateCompetitorsPage(1, totalValues, pageLimit),
    );
    vi.mocked(deleteCompetitor).mockResolvedValueOnce({});

    render(<CompetitorsTable />);

    await waitFor(() => {
      const pagination = screen.getByTestId("pagination");

      vi.mocked(getCompetitors).mockResolvedValueOnce(
        generateCompetitorsPage(2, totalValues, pageLimit),
      );

      fireEvent.click(
        within(pagination).getByRole("button", {
          name: /2/,
        }),
      );
    });

    vi.mocked(getCompetitors).mockResolvedValueOnce(
      generateCompetitorsPage(1, totalValues - 1, pageLimit),
    );

    await waitFor(() => {
      expect(getBodyRows()).toHaveLength(totalValues - pageLimit);
    });

    await deleteAction();

    expect(getCompetitors).toHaveBeenCalledWith(1, pageLimit, "");
    expect(getCompetitors).toHaveBeenCalledTimes(3);
  });

  test("Should render toast with error on delete api", async () => {
    vi.mocked(deleteCompetitor).mockResolvedValueOnce(networkErrorResult);

    render(
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

    render(
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
