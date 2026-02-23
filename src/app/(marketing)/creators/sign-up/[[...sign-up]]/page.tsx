import { SignUp } from "@clerk/nextjs";

const whyPeopleJoin = [
  "Make money from products you already use and trust.",
  "Only promote offers that match your audience.",
  "Get paid for real outcomes, not vanity metrics.",
];

const creatorFlow = [
  {
    step: "1",
    title: "Create your creator profile",
    body: "Add your channels, audience, and topics so builders can send relevant offers.",
  },
  {
    step: "2",
    title: "Pick products you actually use",
    body: "Accept only the partnerships you believe in and would already recommend.",
  },
  {
    step: "3",
    title: "Share and earn",
    body: "Post your unique link on TikTok, X, and LinkedIn. Earn when your followers convert.",
  },
];

const earningsExamples = [
  {
    title: "Starter",
    detail: "15 approved signups",
    payout: "$120 at $8 CPA",
  },
  {
    title: "Consistent",
    detail: "40 approved signups",
    payout: "$320 at $8 CPA",
  },
  {
    title: "High-performing",
    detail: "80 approved activations",
    payout: "$960 at $12 CPA",
  },
];

const faqs = [
  {
    q: "Do I need a huge following?",
    a: "No. Fit and trust matter more than follower count. Builders care about conversion quality.",
  },
  {
    q: "Can I choose what I promote?",
    a: "Yes. You only accept deals you want. You stay in control of every partnership.",
  },
  {
    q: "When do I get paid?",
    a: "Payouts are released after conversions are approved based on each campaign's terms.",
  },
];

export default function CreatorSignUpPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8 md:py-14">
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <section className="space-y-8">
          <div className="rounded-[2rem] bg-gradient-to-br from-rose-100 via-orange-50 to-amber-100 p-7 md:p-10">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-zinc-600">
              For TikTok, X, and LinkedIn creators
            </p>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-zinc-900 md:text-6xl">
              Make money from sharing products you use every day.
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-zinc-700">
              SignalMatch helps you monetize trusted recommendations. Promote products you already use,
              love, and trust, and earn when your followers take real action.
            </p>
            <div className="mt-6 grid gap-3 text-sm text-zinc-700 md:grid-cols-3">
              {whyPeopleJoin.map((item) => (
                <p key={item} className="rounded-2xl bg-white/85 px-4 py-3">
                  {item}
                </p>
              ))}
            </div>
          </div>

          <section className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">How it works</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {creatorFlow.map((item) => (
                <div key={item.step} className="border-l-2 border-rose-300 pl-4">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">Step {item.step}</p>
                  <p className="mt-2 text-base font-semibold text-zinc-900">{item.title}</p>
                  <p className="mt-2 text-sm text-zinc-600">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Example earnings</h2>
            <p className="mt-2 text-sm text-zinc-600">
              These are sample scenarios. Your results depend on your audience fit and campaign performance.
            </p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {earningsExamples.map((item) => (
                <div key={item.title} className="rounded-2xl bg-zinc-50 p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">{item.title}</p>
                  <p className="mt-2 text-sm text-zinc-700">{item.detail}</p>
                  <p className="mt-1 text-lg font-semibold text-zinc-900">{item.payout}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-zinc-900 p-6 text-zinc-100 md:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">Frequently asked questions</h2>
            <div className="mt-5 space-y-4">
              {faqs.map((item) => (
                <div key={item.q}>
                  <p className="font-medium">{item.q}</p>
                  <p className="mt-1 text-sm text-zinc-300">{item.a}</p>
                </div>
              ))}
            </div>
          </section>
        </section>

        <aside className="lg:sticky lg:top-24">
          <div className="rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm md:p-6">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-zinc-500">Create your account</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900">Start earning from your audience</h2>
            <p className="mt-2 text-sm text-zinc-600">
              Join in minutes. Set your creator profile and start receiving relevant campaign offers.
            </p>
            <div className="mt-5 flex justify-center">
              <SignUp
                routing="path"
                path="/creators/sign-up"
                signInUrl="/creators/sign-in"
                fallbackRedirectUrl="/app/onboarding?role=CREATOR"
              />
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
