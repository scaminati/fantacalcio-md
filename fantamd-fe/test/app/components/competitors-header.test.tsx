import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";

import CompetitorsHeader from "@/app/components/competitors-header";

describe("Competitors table component", () => {
  test("Should execute callback applyFilterChange on press 'Enter' keyboard button", () => {
    const applyFilterChangeFn = vi.fn();

    render(
      <CompetitorsHeader
        applyFilterChange={applyFilterChangeFn}
        setModalCompetitor={vi.fn()}
      />,
    );

    fireEvent.keyDown(screen.getByPlaceholderText(/cerca/i), {
      key: "Enter",
      code: "Enter",
      charCode: 13,
    });
    expect(applyFilterChangeFn).toHaveBeenCalledExactlyOnceWith("");
  });

  test("Should update filter value with empty string after press clear button", () => {
    const applyFilterChangeFn = vi.fn();

    render(
      <CompetitorsHeader
        applyFilterChange={applyFilterChangeFn}
        setModalCompetitor={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByPlaceholderText(/cerca/i), {
      target: { value: "search" },
    });
    fireEvent.click(screen.getByLabelText(/clear/i));

    expect(applyFilterChangeFn).toHaveBeenCalledWith("");
  });
});
