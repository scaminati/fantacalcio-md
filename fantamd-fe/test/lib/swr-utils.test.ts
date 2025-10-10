import { describe, expect, test, vi } from "vitest";

import { fetcherWithError } from "@/lib/swr-utils";

describe("SWR utils", () => {
  test("Should return valid json", async () => {
    const data = {
      data: "value",
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => data,
    } as Response);

    const jsonResponse = await fetcherWithError("");

    expect(jsonResponse).toBe(data);
  });

  test("Thrown error with error message retrieved from body", async () => {
    const data = {
      error: "error",
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => data,
    } as Response);
    expect(fetcherWithError("")).rejects.toThrow(data.error);
  });

  test("Thrown error with generic message retrieved from body", async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as Response);
    expect(fetcherWithError("")).rejects.toThrow("Errore nella comunicazione");
  });
});
