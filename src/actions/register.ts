"use server";

import { registerUserWithPassword, type RegisterResult } from "@/lib/register-user";

export type { RegisterResult };

export async function registerWithEmail(input: unknown): Promise<RegisterResult> {
  return registerUserWithPassword(input);
}
