import { describe, expect, test, vi } from "vitest";

import { competitorsResult } from "@/test/test-utils";
import { GET } from "@/app/api/competitors/route";
import { ApiHandlerError, CompetitorPage } from "@/interfaces/interfaces";

vi.mock("@/lib/session", () => ({
  getToken: vi.fn().mockResolvedValue("token"),
}));

async function performCompetitorsGet(
  page: string,
  limit: string,
  search: string,
): Promise<CompetitorPage | ApiHandlerError> {
  const request = new Request(
    `http://localhost/api/competitors?page=${page}&limit=${limit}&search=${search}`,
  );
  const response = await GET(request);

  return await response.json();
}

describe("Competitors api route", () => {
  test("Perform getCompetitors action successfully", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => competitorsResult,
    } as Response);
    const result = (await performCompetitorsGet(
      "1",
      "10",
      "search",
    )) as CompetitorPage;

    expect(fetch).toHaveBeenCalledExactlyOnceWith(
      expect.stringMatching(/page=1.*limit=10.*search=search/),
      expect.anything(),
    );
    expect(result.results).toHaveLength(competitorsResult.results.length);
  });

  test("Send error if getCompetitors action fails", async () => {
    const errorResponse = "Api error";

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        message: errorResponse,
      }),
    } as Response);
    const result = (await performCompetitorsGet(
      "1",
      "10",
      "search",
    )) as ApiHandlerError;

    expect(result.error).toBe(errorResponse);
  });

  test("Send error if getCompetitors action fails without error message", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as Response);
    const result = (await performCompetitorsGet(
      "1",
      "10",
      "search",
    )) as ApiHandlerError;

    expect(result.error).toBe("Errore nel recupero dei partecipanti");
  });
});
