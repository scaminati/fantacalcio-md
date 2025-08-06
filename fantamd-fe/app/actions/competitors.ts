"use server";

import { CompetitorPage } from "@/interfaces/competitor";
import { getToken } from "@/lib/session";

export async function getCompetitors(
  page: number,
  limit: number,
): Promise<CompetitorPage> {
  const token = await getToken();
  const res = await fetch(
    `http://localhost:8080/api/competitors?page=${page}&limit=${limit}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Errore nel recupero dei partecipanti");
  }

  return await res.json();
}
