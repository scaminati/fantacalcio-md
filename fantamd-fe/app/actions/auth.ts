'use server'
import { createSession, deleteSession } from "@/lib/session";

// app/actions/login.ts
export async function login(username: string, password: string) {
  const res = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();
  if (!res.ok || !data.token) {
    throw new Error(data.message || "Accesso fallito");
  }

  await createSession(data.token)
}

export async function logout() {
  await deleteSession();
}