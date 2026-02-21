import { SignIn } from "@clerk/nextjs";

export default function CreatorSignInPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-12 md:px-8">
      <div className="grid w-full gap-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Creator login
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Sign in to manage your partnerships
          </h1>
          <p className="mt-4 max-w-md text-zinc-600">
            Access your creator profile, partnership offers, and payout workflow in one dashboard.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <SignIn
            routing="path"
            path="/creators/sign-in"
            signUpUrl="/creators/sign-up"
            fallbackRedirectUrl="/app/onboarding?role=CREATOR"
          />
        </div>
      </div>
    </main>
  );
}
