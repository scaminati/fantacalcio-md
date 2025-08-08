"use server";

import { Competitor, CompetitorPage } from "@/interfaces/competitor";
import { getToken } from "@/lib/session";

export async function getCompetitors(
  page: number,
  limit: number,
  search: string,
): Promise<CompetitorPage> {
  const token = await getToken();
  const res = await fetch(
    `http://localhost:8080/api/competitors?page=${page}&limit=${limit}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const respBody = await res.json();

  if (!res.ok) {
    throw new Error(respBody.message || "Errore nel recupero dei partecipanti");
  }

  return respBody;
}

export async function saveCompetitor(
  competitor: Competitor,
): Promise<Competitor> {
  const token = await getToken();
  let competitorPath = "http://localhost:8080/api/competitors";

  if (competitor.id != null) competitorPath += `/${competitor.id}`;

  const res = await fetch(competitorPath, {
    method: competitor.id ? "PATCH" : "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(competitor),
  });

  const respBody = await res.json();

  if (!res.ok) {
    throw new Error(
      respBody.message || "Errore nel salvataggio del partecipante",
    );
  }

  return respBody;
}

export async function deleteCompetitor(competitor: Competitor): Promise<void> {
  const token = await getToken();

  const res = await fetch(
    `http://localhost:8080/api/competitors/${competitor.id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const respBody = await res.json();

  if (!res.ok) {
    throw new Error(
      respBody.message || "Errore nella cancellazione del partecipante",
    );
  }
}
