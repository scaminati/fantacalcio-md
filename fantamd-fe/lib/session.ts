import "server-only";

import { cookies } from "next/headers";

export async function createSession(session: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;

  if (!session) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();

  cookieStore.delete("session");
}

export async function isAuthenticated() {
  const cookieStore = await cookies();

  return cookieStore.get("session")?.value != null;
}

export async function getToken() {
  const cookieStore = await cookies();

  return cookieStore.get("session")!.value;
}
