"use server";

import envConfig from "@/config/envConfig";
import {
  ActionResponse,
  Competitor,
  CompetitorPage,
} from "@/interfaces/interfaces";
import { getToken } from "@/lib/session";

export async function getCompetitors(
  page: number,
  limit: number,
  search: string,
): Promise<ActionResponse<CompetitorPage>> {
  const token = await getToken();
  const res = await fetch(
    `${envConfig.BE_URL}/api/competitors?page=${page}&limit=${limit}&search=${search}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const respBody = await res.json();

  if (!res.ok) {
    return {
      error: respBody.message || "Errore nel recupero dei partecipanti",
    };
  }

  return {
    data: respBody,
  };
}

export async function saveCompetitor(
  competitor: Competitor,
): Promise<ActionResponse<Competitor>> {
  const token = await getToken();
  let competitorPath = `${envConfig.BE_URL}/api/competitors`;

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
    return {
      error: respBody.message || "Errore nel salvataggio del partecipante",
    };
  }

  return {
    data: respBody,
  };
}

export async function deleteCompetitor(competitor: Competitor): Promise<
  ActionResponse<{
    id: number;
  }>
> {
  const token = await getToken();

  const res = await fetch(
    `${envConfig.BE_URL}/api/competitors/${competitor.id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const respBody = await res.json();

  if (!res.ok) {
    return {
      error: respBody.message || "Errore nella cancellazione del partecipante",
    };
  }

  return {
    data: respBody,
  };
}
