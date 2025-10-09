import { NextResponse } from "next/server";

import envConfig from "@/config/envConfig";
import { getToken } from "@/lib/session";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const token = await getToken();
  const res = await fetch(
    `${envConfig.BE_URL}/api/competitors?${searchParams}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  const respBody = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: respBody.message || "Errore nel recupero dei partecipanti" },
      { status: res.status },
    );
  }

  return NextResponse.json(respBody);
}
