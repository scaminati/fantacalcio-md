import { describe, expect, test, vi } from "vitest";
import { fireEvent, screen, within } from "@testing-library/dom";

import CompetitorCard, {
  CompetitorCardSkeleton,
} from "@/app/components/competitor-card";
import { renderWithAdapter } from "@/test/custom-renders";
import { competitorMock } from "@/test/test-utils";

const setModalMock = vi.fn();
const setDeleteMock = vi.fn();

describe("Competitors card component", () => {
  test("Should render competitor card component", () => {
    renderWithAdapter(
      <CompetitorCard
        competitor={competitorMock}
        listIndex={1}
        setDeleteCompetitor={setDeleteMock}
        setModalCompetitor={setModalMock}
      />,
    );

    const userComponent = screen.getByTestId("user");

    expect(
      within(userComponent).getByText(competitorMock.fullname),
    ).toBeDefined();
    expect(within(userComponent).getByText(competitorMock.email)).toBeDefined();
  });

  test("Should render card skeleton component", () => {
    renderWithAdapter(<CompetitorCardSkeleton />);
    expect(screen.getByTestId("user-skeleton")).toBeDefined();
  });

  test("Should open competitor and delete modal", () => {
    renderWithAdapter(
      <CompetitorCard
        competitor={competitorMock}
        listIndex={1}
        setDeleteCompetitor={setDeleteMock}
        setModalCompetitor={setModalMock}
      />,
    );

    fireEvent.click(screen.getByTestId("actions-btn"));
    fireEvent.click(screen.getByTestId("edit-btn"));

    expect(setModalMock).toHaveBeenCalledOnce();

    fireEvent.click(screen.getByTestId("actions-btn"));
    fireEvent.click(screen.getByTestId("delete-btn"));

    expect(setDeleteMock).toHaveBeenCalledOnce();
  });
});
