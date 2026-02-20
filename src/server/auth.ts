import "server-only";

import { auth } from "@clerk/nextjs/server";

import { findUserByClerkId } from "@/server/db/read";
import { createUserIfMissing } from "@/server/db/write";
import type { UserRole } from "@/server/db/types";

export async function getAuthContext() {
  const authState = await auth();

  if (!authState.userId) {
    return null;
  }

  const user = await createUserIfMissing(authState.userId);

  return {
    clerkUserId: authState.userId,
    userId: user.id,
    role: user.role as UserRole | null,
  };
}

export async function requireAuthContext() {
  const context = await getAuthContext();

  if (!context) {
    throw new Error("Unauthorized");
  }

  return context;
}

export async function requireRole(roles: UserRole[]) {
  const context = await requireAuthContext();

  if (!context.role || !roles.includes(context.role)) {
    throw new Error("Forbidden");
  }

  return context;
}

export async function getAuthContextFromClerkId(clerkUserId: string) {
  const user = await findUserByClerkId(clerkUserId);

  if (!user) {
    return createUserIfMissing(clerkUserId);
  }

  return user;
}
