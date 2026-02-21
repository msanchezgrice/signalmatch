import { SignUp } from "@clerk/nextjs";

export default function BuilderSignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-12 md:px-8">
      <div className="grid w-full gap-8 md:grid-cols-2 md:items-center">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
            Builder signup
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Build creator campaigns that drive qualified users
          </h1>
          <p className="mt-4 max-w-md text-zinc-600">
            Create your builder account to launch campaigns, track conversion quality, and pay only for approved outcomes.
          </p>
        </div>
        <div className="flex justify-center md:justify-end">
          <SignUp
            routing="path"
            path="/builders/sign-up"
            signInUrl="/builders/sign-in"
            fallbackRedirectUrl="/app/onboarding?role=BUILDER"
          />
        </div>
      </div>
    </main>
  );
}
