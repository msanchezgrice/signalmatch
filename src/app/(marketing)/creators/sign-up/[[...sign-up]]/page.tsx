import Link from "next/link";
import { cookies } from "next/headers";
import { SignUp } from "@clerk/nextjs";
import { CREATOR_PREFILL_COOKIE_NAME } from "@/server/lib/creator-profile-prefill";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function CreatorSignUpPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const cookieStore = await cookies();
  const prefillFromQuery =
    typeof params.prefill === "string" && params.prefill.length > 0
      ? params.prefill
      : null;
  const prefillFromCookie = cookieStore.get(CREATOR_PREFILL_COOKIE_NAME)?.value ?? null;
  const prefill = prefillFromQuery ?? prefillFromCookie;
  const encodedQueryPrefill = prefillFromQuery ? encodeURIComponent(prefillFromQuery) : null;
  const redirectUrl = encodedQueryPrefill
    ? `/app/creator/onboarding?prefill=${encodedQueryPrefill}`
    : "/app/creator/onboarding";
  const creatorSignInUrl = encodedQueryPrefill
    ? `/creators/sign-in?prefill=${encodedQueryPrefill}`
    : "/creators/sign-in";

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:px-8 md:py-16">
      <section className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-10">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-500">
          Creator onboarding
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-900 md:text-5xl">
          Create your account and start earning from products you already use.
        </h1>
        <p className="mt-4 text-zinc-600">
          One flow only: create your account, complete onboarding, and start receiving relevant partnership offers.
        </p>
        <ul className="mt-5 space-y-2 text-sm text-zinc-700">
          <li>1. Add your social URLs and handles (LinkedIn, X, TikTok, YouTube, etc.)</li>
          <li>2. Add follower counts and average impressions</li>
          <li>3. Add interests and audience profile for better campaign matching</li>
        </ul>
        {prefill ? (
          <p className="mt-5 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
            Profile details detected. We will pre-fill your onboarding details after signup.
          </p>
        ) : null}
      </section>

      <section className="mt-6 rounded-3xl border border-zinc-200 bg-white p-4 md:p-6">
        <div className="flex justify-center">
          <SignUp
            routing="path"
            path="/creators/sign-up"
            signInUrl={creatorSignInUrl}
            fallbackRedirectUrl={redirectUrl}
            forceRedirectUrl={redirectUrl}
          />
        </div>
        <p className="mt-4 text-center text-xs text-zinc-500">
          Already have an account?{" "}
          <Link href={creatorSignInUrl} className="font-medium text-zinc-800 underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
