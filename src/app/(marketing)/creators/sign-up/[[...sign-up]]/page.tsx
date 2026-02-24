import { cookies } from "next/headers";
import { CreatorSignupHappyPath } from "@/components/marketing/creator-signup-happy-path";
import { CREATOR_PREFILL_COOKIE_NAME } from "@/server/lib/creator-profile-prefill";
import { decodeCreatorPrefillToken } from "@/server/lib/creator-profile-prefill";

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
  const prefillToken = prefillFromQuery ?? prefillFromCookie;
  const prefill = decodeCreatorPrefillToken(prefillToken);
  const encodedQueryPrefill = prefillFromQuery ? encodeURIComponent(prefillFromQuery) : null;
  const redirectUrl = encodedQueryPrefill
    ? `/app/creator/onboarding/complete?prefill=${encodedQueryPrefill}`
    : "/app/creator/onboarding/complete";
  const creatorSignInUrl = encodedQueryPrefill
    ? `/creators/sign-in?prefill=${encodedQueryPrefill}`
    : "/creators/sign-in";

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-12 md:px-8 md:py-16">
      <CreatorSignupHappyPath
        initialPrefill={prefill}
        redirectUrl={redirectUrl}
        signInUrl={creatorSignInUrl}
      />
    </main>
  );
}
