"use server";

import { redirect } from "next/navigation";

import { createSession, deleteSession } from "@/lib/session";
import envConfig from "@/config/envConfig";
import { ActionResponse, Auth } from "@/interfaces/interfaces";

export async function login(
  username: string,
  password: string,
): Promise<ActionResponse<Auth>> {
  const res = await fetch(`${envConfig.BE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = await res.json();

  if (!res.ok || !data.token) {
    return { error: data.message };
  }

  await createSession(data.token);

  return {
    data: data,
  };
}

export async function logout() {
  await deleteSession();
  redirect("/login");
}
