import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getShowcaseCreator } from "@/lib/showcase-creators";
import { getCreatorById } from "@/server/db/read";

type Props = { params: Promise<{ id: string }> };

export default async function CreatorDetailPage({ params }: Props) {
  const { id } = await params;
  const showcaseCreator = id.startsWith("example-")
    ? getShowcaseCreator(id.replace(/^example-/, ""))
    : undefined;

  if (showcaseCreator) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
        <div className="rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-center text-xs font-semibold tracking-[0.12em] text-orange-800 uppercase">
          Illustrative creator example · not a live marketplace participant
        </div>
        <section className="mt-5 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-[0_30px_90px_rgba(24,24,27,0.1)]">
          <div className="h-28 bg-gradient-to-r from-orange-100 via-rose-50 to-violet-100" />
          <div className="px-7 pb-8 md:px-10">
            <Image src={showcaseCreator.avatarUrl} alt={showcaseCreator.displayName} width={112} height={112} unoptimized className="-mt-14 size-28 rounded-3xl border-4 border-white bg-white object-cover shadow-lg" />
            <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold tracking-[0.16em] text-orange-700 uppercase">{showcaseCreator.channels[0]?.platform} creator</p>
                <h1 className="mt-2 text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">{showcaseCreator.displayName}</h1>
                <p className="mt-1 text-zinc-500">{showcaseCreator.handle}</p>
                <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-700">{showcaseCreator.bio}</p>
              </div>
              <Button asChild><Link href="/creators/sign-up">Join as a real creator</Link></Button>
            </div>
          </div>
        </section>

        <section className="mt-8 grid gap-6 md:grid-cols-[1.25fr_0.75fr]">
          <div className="rounded-3xl border border-zinc-200 bg-white p-7">
            <p className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">Channel evidence preview</p>
            {showcaseCreator.channels.map((channel) => (
              <div key={`${channel.platform}-${channel.handle}`} className="mt-4 grid gap-4 rounded-2xl bg-zinc-950 p-5 text-white sm:grid-cols-3">
                <div><p className="text-xs text-white/45">Channel</p><p className="mt-1 font-semibold capitalize">{channel.platform}</p></div>
                <div><p className="text-xs text-white/45">Audience</p><p className="mt-1 text-sm">{channel.followersLabel}</p></div>
                <div><p className="text-xs text-white/45">Average reach</p><p className="mt-1 font-semibold">{channel.reachLabel}</p></div>
              </div>
            ))}
          </div>
          <aside className="rounded-3xl border border-zinc-200 bg-white p-7">
            <p className="text-xs font-semibold tracking-[0.14em] text-zinc-500 uppercase">Brand fit</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[...showcaseCreator.niches, ...showcaseCreator.audienceTags].map((tag) => <span key={tag} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs text-orange-800">{tag}</span>)}
            </div>
            <p className="mt-6 text-sm text-zinc-500">Example payout range</p>
            <p className="mt-1 font-semibold text-zinc-950">{showcaseCreator.suggestedPayout}</p>
          </aside>
        </section>

        <Link href="/explore/creators" className="mt-8 inline-flex text-sm font-semibold text-zinc-700 hover:text-orange-700">← Back to creator directory</Link>
      </div>
    );
  }

  const creator = await getCreatorById(id);

  if (!creator) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-orange-50 via-white to-rose-50 p-7 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <Image
            src={
              (creator.avatar_url as string | null) ??
              "https://api.dicebear.com/9.x/shapes/svg?seed=signalmatch"
            }
            alt={creator.display_name}
            width={96}
            height={96}
            unoptimized
            className="h-24 w-24 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
              Creator profile
            </p>
            <h1 className="mt-2 text-4xl font-semibold tracking-tight">{creator.display_name}</h1>
            <p className="mt-3 max-w-3xl text-zinc-700">{creator.bio || "No bio yet."}</p>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <h2 className="text-lg font-semibold tracking-tight">Channels</h2>
          <div className="mt-3 space-y-3">
            {(creator.channels as any[]).map((channel) => (
              <div
                key={`${channel.platform}-${channel.handle}`}
                className="flex items-center justify-between rounded-2xl border border-zinc-200/80 bg-white px-4 py-3"
              >
                <div>
                  <p className="font-medium text-zinc-900">
                    {(channel.platform as string).toUpperCase()} · @{channel.handle}
                  </p>
                  <p className="text-sm text-zinc-600">{channel.url}</p>
                </div>
                <div className="text-right text-sm text-zinc-700">
                  <p>{Number(channel.followers || 0).toLocaleString()} followers</p>
                  <p>{Number(channel.avg_impressions || 0).toLocaleString()} avg impressions</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <aside>
          <h2 className="text-lg font-semibold tracking-tight">Audience fit</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {((creator.niches as string[]) || []).map((tag) => (
              <span key={tag} className="rounded-full bg-orange-100 px-2.5 py-1 text-xs text-zinc-700">
                {tag}
              </span>
            ))}
            {((creator.audience_tags as string[]) || []).map((tag) => (
              <span key={tag} className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700">
                {tag}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs uppercase tracking-wide text-zinc-500">
            Verification: {(creator.verification_status as string) ?? "unverified"}
          </p>
        </aside>
      </section>
    </div>
  );
}
