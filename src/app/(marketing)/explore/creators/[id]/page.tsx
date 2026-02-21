import { notFound } from "next/navigation";

import { getCreatorById } from "@/server/db/read";

type Props = { params: Promise<{ id: string }> };

export default async function CreatorDetailPage({ params }: Props) {
  const { id } = await params;
  const creator = await getCreatorById(id);

  if (!creator) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-8">
      <section className="rounded-[2rem] bg-gradient-to-br from-orange-50 via-white to-rose-50 p-7 md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center">
          <img
            src={
              (creator.avatar_url as string | null) ??
              "https://api.dicebear.com/9.x/shapes/svg?seed=signalmatch"
            }
            alt={creator.display_name}
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
