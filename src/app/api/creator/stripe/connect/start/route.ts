import { NextResponse } from "next/server";

import { env } from "@/server/env";
import { requireRole } from "@/server/auth";
import { getCreatorProfileByUserId } from "@/server/db/read";
import { setCreatorStripeAccount } from "@/server/db/write";
import { stripe } from "@/server/stripe";

export async function POST() {
  try {
    const authContext = await requireRole(["CREATOR", "ADMIN"]);
    const profile = await getCreatorProfileByUserId(authContext.userId);

    if (!profile) {
      return NextResponse.json(
        { ok: false, error: "Complete your creator profile first" },
        { status: 400 },
      );
    }

    let accountId = profile.stripe_account_id as string | null;

    if (!accountId) {
      const account = await stripe.accounts.create({
        type: "express",
        metadata: {
          creator_user_id: authContext.userId,
        },
      });
      accountId = account.id;
      await setCreatorStripeAccount(authContext.userId, account.id);
    }

    const link = await stripe.accountLinks.create({
      account: accountId,
      type: "account_onboarding",
      return_url:
        env.STRIPE_CONNECT_RETURN_URL ?? `${env.NEXT_PUBLIC_APP_URL}/app/creator/payouts`,
      refresh_url:
        env.STRIPE_CONNECT_REFRESH_URL ??
        `${env.NEXT_PUBLIC_APP_URL}/app/creator/payouts?refresh=1`,
    });

    return NextResponse.json({ ok: true, url: link.url, account_id: accountId });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500 },
    );
  }
}
