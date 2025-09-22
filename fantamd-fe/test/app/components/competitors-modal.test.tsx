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
import { getCompetitors, saveCompetitor } from "@/app/actions/competitors";
import {
  competitorMock,
  competitorsResult,
  generateCompetitorsPage,
  networkErrorResult,
} from "@/test/test-utils";
import CompetitorsModal from "@/app/components/competitors-modal";
import { Competitor } from "@/interfaces/interfaces";

const pageLimit = 15;
const totalValues = 20;

vi.mock("@heroui/toast", () => ({
  addToast: vi.fn(),
}));

vi.mock("@/app/actions/competitors", () => ({
  getCompetitors: vi.fn(),
  saveCompetitor: vi.fn(),
}));

const getBodyRows = () => {
  const table = screen.getByTestId("competitors-table");
  const allRows = within(table).getAllByRole("row");

  return allRows.filter((row) => row.closest("tbody"));
};

describe("Competitors modal component", () => {
  const addCompetitorAction = async () => {
    const addBtn = screen.getByRole("button", { name: /aggiungi/i });

    fireEvent.click(addBtn);
    await waitFor(() => {
      fillForm(screen.getByRole("dialog"));
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });
  };

  const fillForm = (dialog: HTMLElement) => {
    // fill all fields
    fireEvent.change(within(dialog).getByLabelText(/nome/i), {
      target: { value: competitorMock.fullname },
    });
    fireEvent.change(within(dialog).getByLabelText(/email/i), {
      target: { value: competitorMock.email },
    });
    fireEvent.change(within(dialog).getByLabelText(/telefono/i), {
      target: { value: competitorMock.phone },
    });
    fireEvent.change(within(dialog).getByLabelText(/pagato/i), {
      target: { value: competitorMock.paid },
    });
    fireEvent.click(within(dialog).getByLabelText(/aggiunto in app/i));

    fireEvent.click(within(dialog).getByRole("button", { name: /salva/i }));
  };

  test("Should open competitor add and edit modal", async () => {
    vi.mocked(getCompetitors).mockResolvedValueOnce(competitorsResult);

    render(<CompetitorsTable />);

    const addBtn = screen.getByRole("button", { name: /aggiungi/i });

    fireEvent.click(addBtn);
    await waitFor(() => {
      const addDialog = screen.getByRole("dialog");

      expect(addDialog).toBeDefined();
      expect(within(addDialog).getByText("Aggiungi")).toBeDefined();
      fireEvent.click(
        within(addDialog).getByRole("button", { name: /chiudi/i }),
      );
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    const actionsBtn = await within(getBodyRows()[0]).findByTestId(
      "actions-btn",
    );

    fireEvent.click(actionsBtn);
    fireEvent.click(screen.getByTestId("edit-btn"));

    await waitFor(() => {
      const editDialog = screen.getByRole("dialog");

      expect(editDialog).toBeDefined();
      expect(within(editDialog).getByText("Modifica")).toBeDefined();
    });
  });

  test("Should add new competitor", async () => {
    vi.mocked(getCompetitors).mockResolvedValueOnce(competitorsResult);
    vi.mocked(saveCompetitor).mockResolvedValueOnce({
      data: competitorMock,
    });

    render(<CompetitorsTable />);

    await addCompetitorAction();

    expect(saveCompetitor).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        fullname: competitorMock.fullname,
        email: competitorMock.email,
        phone: competitorMock.phone,
        paid: competitorMock.paid,
      }),
    );
    expect(getCompetitors).toHaveBeenCalledTimes(2);
  });

  test("Should edit competitor and update directly table row", async () => {
    vi.mocked(getCompetitors).mockResolvedValueOnce(competitorsResult);
    vi.mocked(saveCompetitor).mockResolvedValueOnce({
      data: competitorMock,
    });

    render(<CompetitorsTable />);

    await waitFor(() => {
      fireEvent.click(within(getBodyRows()[0]).getByTestId("actions-btn"));
      fireEvent.click(screen.getByTestId("edit-btn"));
    });

    await waitFor(() => {
      const dialog = screen.getByRole("dialog");

      fireEvent.change(within(dialog).getByLabelText(/nome/i), {
        target: { value: competitorMock.fullname },
      });

      fireEvent.click(within(dialog).getByRole("button", { name: /salva/i }));
    });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).toBeNull();
    });

    expect(saveCompetitor).toHaveBeenCalledExactlyOnceWith(
      expect.objectContaining({
        fullname: competitorMock.fullname,
      }),
    );
    expect(getCompetitors).toHaveBeenCalledOnce();
    expect(
      within(getBodyRows()[0]).getByText(competitorMock.fullname),
    ).toBeDefined();
  });

  test("Should add new competitor and reload first page", async () => {
    vi.mocked(getCompetitors).mockResolvedValue(
      generateCompetitorsPage(1, totalValues, pageLimit),
    );
    vi.mocked(saveCompetitor).mockResolvedValueOnce({
      data: competitorMock,
    });

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
      generateCompetitorsPage(2, totalValues + 1, pageLimit),
    );

    await waitFor(() => {
      expect(getBodyRows()).toHaveLength(totalValues - pageLimit);
    });

    await addCompetitorAction();

    expect(getCompetitors).toHaveBeenCalledWith(1, pageLimit, "");
    expect(getCompetitors).toHaveBeenCalledTimes(3);
  });

  test("Should render toast with error on save api", async () => {
    vi.mocked(saveCompetitor).mockResolvedValueOnce(networkErrorResult);

    render(
      <CompetitorsModal
        competitor={{} as Competitor}
        onCloseEvent={vi.fn()}
        onSavedEvent={vi.fn()}
      />,
    );

    fillForm(screen.getByRole("dialog"));

    fireEvent.click(screen.getByRole("button", { name: /salva/i }));
    await waitFor(() => {
      expect(addToast).toHaveBeenCalledWith({
        title: "Network error",
        color: "danger",
      });
    });
  });

  test("Should render toast with uncatch error on save api", async () => {
    vi.mocked(saveCompetitor).mockImplementationOnce(() => {
      throw new Error("Generic error");
    });

    render(
      <CompetitorsModal
        competitor={{} as Competitor}
        onCloseEvent={vi.fn()}
        onSavedEvent={vi.fn()}
      />,
    );

    fillForm(screen.getByRole("dialog"));

    fireEvent.click(screen.getByRole("button", { name: /salva/i }));
    await waitFor(() => {
      expect(addToast).toHaveBeenCalledWith({
        title: "Errore nella comunicazione",
        color: "danger",
      });
    });
  });

  test("Should render toast without error message on save api", async () => {
    vi.mocked(saveCompetitor).mockResolvedValueOnce({
      error: undefined,
    });

    render(
      <CompetitorsModal
        competitor={{} as Competitor}
        onCloseEvent={vi.fn()}
        onSavedEvent={vi.fn()}
      />,
    );

    fillForm(screen.getByRole("dialog"));

    fireEvent.click(screen.getByRole("button", { name: /salva/i }));
    await waitFor(() => {
      expect(addToast).toHaveBeenCalledWith({
        title: "Salvataggio partecipante fallito",
        color: "danger",
      });
    });
  });
});
