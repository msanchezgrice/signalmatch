import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createUserIfMissing: vi.fn(),
  deleteUserByClerkId: vi.fn(),
  verify: vi.fn(),
  createWebhook: vi.fn(),
}));

vi.mock("@/server/env", () => ({
  env: { CLERK_WEBHOOK_SIGNING_SECRET: "whsec_test" },
}));

vi.mock("@/server/db/write", () => ({
  createUserIfMissing: mocks.createUserIfMissing,
  deleteUserByClerkId: mocks.deleteUserByClerkId,
}));

vi.mock("svix", () => ({
  Webhook: function Webhook(secret: string) {
    return mocks.createWebhook(secret);
  },
}));

import { POST as handleClerkWebhook } from "@/app/api/webhooks/clerk/route";

function clerkRequest(headers: Record<string, string> = {}) {
  return new Request("https://www.signalmatch.me/api/webhooks/clerk", {
    method: "POST",
    headers,
    body: JSON.stringify({ type: "user.created" }),
  });
}

const validHeaders = {
  "svix-id": "msg_test",
  "svix-timestamp": "1784220000",
  "svix-signature": "v1,test",
};

describe("Clerk webhook behavior", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.createWebhook.mockReturnValue({ verify: mocks.verify });
    mocks.verify.mockReturnValue({
      type: "user.created",
      data: { id: "user_test" },
    });
  });

  it("rejects requests without the complete Svix header set", async () => {
    const response = await handleClerkWebhook(clerkRequest());

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      error: "Missing Clerk webhook headers",
    });
    expect(mocks.createWebhook).not.toHaveBeenCalled();
  });

  it("returns a generic 400 for an invalid signature", async () => {
    mocks.verify.mockImplementation(() => {
      throw new Error("raw signature details");
    });

    const response = await handleClerkWebhook(clerkRequest(validHeaders));
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Invalid Clerk signature");
    expect(JSON.stringify(body)).not.toContain("raw signature details");
  });

  it.each(["user.created", "user.updated"])(
    "upserts the local user for %s",
    async (type) => {
      mocks.verify.mockReturnValue({ type, data: { id: "user_test" } });

      const response = await handleClerkWebhook(clerkRequest(validHeaders));

      expect(response.status).toBe(200);
      expect(mocks.createUserIfMissing).toHaveBeenCalledWith("user_test");
    },
  );

  it("deletes the local user for user.deleted", async () => {
    mocks.verify.mockReturnValue({
      type: "user.deleted",
      data: { id: "user_test" },
    });

    const response = await handleClerkWebhook(clerkRequest(validHeaders));

    expect(response.status).toBe(200);
    expect(mocks.deleteUserByClerkId).toHaveBeenCalledWith("user_test");
  });

  it("returns a generic 500 when user synchronization fails", async () => {
    mocks.createUserIfMissing.mockRejectedValue(
      new Error("raw database details"),
    );

    const response = await handleClerkWebhook(clerkRequest(validHeaders));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.error).toBe("Webhook processing failed");
    expect(JSON.stringify(body)).not.toContain("raw database details");
  });
});
