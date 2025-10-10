import { describe, expect, test, vi } from "vitest";

import { competitorMock } from "@/test/test-utils";
import { deleteCompetitor, saveCompetitor } from "@/app/actions/competitors";

vi.mock("@/lib/session", () => ({
  getToken: vi.fn().mockResolvedValue("token"),
}));

describe("Competitors actions", () => {
  test("Perform saveCompetitor with new object successfully", async () => {
    let newCompetitor = { ...competitorMock, id: undefined };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => competitorMock,
    } as Response);
    const result = await saveCompetitor(newCompetitor);

    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      expect.not.stringContaining(`/${competitorMock.id}`),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(newCompetitor),
      }),
    );
    expect(result.data).toBe(competitorMock);
  });

  test("Perform saveCompetitor with existing object successfully", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => competitorMock,
    } as Response);
    const result = await saveCompetitor(competitorMock);

    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      expect.stringContaining(`/${competitorMock.id}`),
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify(competitorMock),
      }),
    );
    expect(result.data).toBe(competitorMock);
  });

  test("Send error if saveCompetitor action fails", async () => {
    const errorResponse = "Api error";

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: errorResponse,
      }),
    } as Response);
    const result = await saveCompetitor(competitorMock);

    expect(result.error).toBe(errorResponse);
  });

  test("Send error if saveCompetitor action fails without error message", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as Response);
    const result = await saveCompetitor(competitorMock);

    expect(result.error).toBe("Errore nel salvataggio del partecipante");
  });

  test("Perform deleteCompetitor successfully", async () => {
    const deleteResponse = {
      id: competitorMock.id,
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => deleteResponse,
    } as Response);
    const result = await deleteCompetitor(competitorMock);

    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      expect.stringContaining(`/${competitorMock.id}`),
      expect.objectContaining({
        method: "DELETE",
      }),
    );
    expect(result.data).toBe(deleteResponse);
  });

  test("Send error if deleteCompetitor action fails", async () => {
    const errorResponse = "Api error";

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: errorResponse,
      }),
    } as Response);
    const result = await deleteCompetitor(competitorMock);

    expect(result.error).toBe(errorResponse);
  });

  test("Send error if deleteCompetitor action fails without error message", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as Response);
    const result = await deleteCompetitor(competitorMock);

    expect(result.error).toBe("Errore nella cancellazione del partecipante");
  });
});
