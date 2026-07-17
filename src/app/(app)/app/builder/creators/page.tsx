import { ArrowRight, CircleDollarSign, MailPlus, Search, Sparkles, UsersRound } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sampleCreators } from "@/lib/sample-creators";
import { getAuthContext } from "@/server/auth";
import { getCreatorDirectory } from "@/server/db/read";

type Props = {
  searchParams: Promise<{ query?: string; platform?: string }>;
};

export default async function BuilderCreatorDiscoveryPage({ searchParams }: Props) {
  const authContext = await getAuthContext();
  if (!authContext) redirect("/");
  if (authContext.role !== "BUILDER") redirect("/app");

  const params = await searchParams;
  const query = params.query?.trim() ?? "";
  const platform = params.platform?.trim() ?? "";
  const live = await getCreatorDirectory({
    query: query || undefined,
    platforms: platform ? [platform.toLowerCase()] : [],
    verificationStatus: "any",
    limit: 24,
    offset: 0,
  });

  const filteredSamples = sampleCreators.filter((creator) => {
    const haystack = `${creator.name} ${creator.handle} ${creator.platform} ${creator.niche} ${creator.audience}`.toLowerCase();
    const matchesQuery = !query || haystack.includes(query.toLowerCase());
    const matchesPlatform = !platform || creator.platform.toLowerCase() === platform.toLowerCase();
    return matchesQuery && matchesPlatform;
  });

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-[var(--app-border-strong)] bg-[#10263a] p-6 text-white shadow-[0_24px_80px_rgba(19,56,79,0.12)] md:p-9">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <div>
            <Badge className="border-white/15 bg-white/10 text-white hover:bg-white/10">Creator discovery</Badge>
            <h1 className="mt-5 max-w-3xl text-3xl leading-tight font-semibold tracking-tight md:text-4xl">
              Find people whose audience already has the problem you solve.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
              Start with recommended matches, compare why they fit, then invite through a funded campaign. Sample profiles below show what a complete match will look like while the live directory grows.
            </p>
          </div>
          <Button asChild className="bg-[#58e0d3] text-[#10263a] hover:bg-[#79eadf]">
            <Link href="/app/builder/campaigns">
              Choose a campaign to invite
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      <section className="rounded-3xl border app-surface p-5 md:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-xs font-semibold tracking-[0.16em] text-[#087f77] uppercase">Search all</p>
            <h2 className="mt-2 text-xl font-semibold">Describe the creator or audience you want</h2>
          </div>
          <form action="/app/builder/creators" className="grid gap-2 sm:grid-cols-[minmax(240px,1fr)_160px_auto]">
            <div className="relative">
              <Search className="app-subtle-text pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
              <Input name="query" defaultValue={query} placeholder="AI founders, ecommerce, wellness…" className="pl-9" />
            </div>
            <select name="platform" defaultValue={platform} className="app-surface h-9 rounded-md border px-3 text-sm">
              <option value="">All channels</option>
              <option value="YouTube">YouTube</option>
              <option value="TikTok">TikTok</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Newsletter">Newsletter</option>
              <option value="Instagram">Instagram</option>
            </select>
            <Button type="submit">Search</Button>
          </form>
        </div>
      </section>

      {live.creators.length > 0 ? (
        <section>
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-semibold tracking-[0.16em] text-[#087f77] uppercase">Live directory</p>
              <h2 className="mt-1 text-xl font-semibold">Available creators</h2>
            </div>
            <Badge variant="outline">{live.creators.length} live</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {live.creators.map((creator) => (
              <article key={creator.creator_profile_id} className="rounded-3xl border app-surface p-5">
                <div className="flex items-center gap-3">
                  <Image
                    src={creator.avatar_url ?? `https://api.dicebear.com/9.x/shapes/svg?seed=${creator.creator_profile_id}`}
                    alt=""
                    width={48}
                    height={48}
                    unoptimized
                    className="size-12 rounded-2xl bg-[var(--app-muted-surface)] object-cover"
                  />
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{creator.display_name}</h3>
                    <p className="app-subtle-text truncate text-xs">{creator.niches.slice(0, 2).join(" · ") || "Creator"}</p>
                  </div>
                </div>
                <p className="app-muted-text mt-4 line-clamp-3 text-sm leading-6">{creator.bio || "Performance-oriented creator profile."}</p>
                <Button asChild variant="outline" className="mt-5 w-full">
                  <Link href={`/explore/creators/${creator.creator_profile_id}`}>View profile</Link>
                </Button>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-[#7257ff]">
              <Sparkles className="size-4" />
              <p className="font-mono text-xs font-semibold tracking-[0.16em] uppercase">Sample matches</p>
            </div>
            <h2 className="mt-2 text-xl font-semibold">See what a strong creator match includes</h2>
            <p className="app-muted-text mt-1 text-sm">These fictional profiles are examples, not creators available for invitation.</p>
          </div>
          <Button asChild variant="outline">
            <a href="mailto:?subject=Join%20my%20creator%20campaign%20on%20SignalMatch&body=I%27d%20like%20to%20invite%20you%20to%20a%20performance%20creator%20campaign.%20Create%20your%20profile%20at%20https%3A%2F%2Fwww.signalmatch.me%2Fcreators%2Fsign-up">
              <MailPlus className="size-4" />
              Invite someone you know
            </a>
          </Button>
        </div>

        {filteredSamples.length === 0 ? (
          <div className="rounded-3xl border app-surface p-10 text-center">
            <UsersRound className="mx-auto size-8 text-[#087f77]" />
            <h3 className="mt-4 font-semibold">No example matches for those filters</h3>
            <p className="app-muted-text mt-2 text-sm">Try a broader audience term or clear the channel filter.</p>
            <Button asChild variant="outline" className="mt-5"><Link href="/app/builder/creators">Clear filters</Link></Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredSamples.map((creator) => (
              <article key={creator.id} className="group rounded-3xl border app-surface p-5 transition hover:-translate-y-1 hover:border-[#07988d] hover:shadow-[0_18px_40px_rgba(19,56,79,0.1)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-3">
                    <Image src={creator.avatarUrl} alt="" width={52} height={52} unoptimized className="size-13 rounded-2xl bg-[#e8fbf8] object-cover" />
                    <div className="min-w-0">
                      <h3 className="truncate font-semibold">{creator.name}</h3>
                      <p className="app-subtle-text truncate text-xs">{creator.handle} · {creator.platform}</p>
                    </div>
                  </div>
                  <Badge className="shrink-0 bg-[#e8fbf8] text-[#087f77] hover:bg-[#e8fbf8]">{creator.matchScore}% match</Badge>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-[var(--app-muted-surface)] p-3">
                    <p className="app-subtle-text text-[10px] font-semibold tracking-wide uppercase">Audience</p>
                    <p className="mt-1 font-medium">{creator.audience}</p>
                  </div>
                  <div className="rounded-xl bg-[var(--app-muted-surface)] p-3">
                    <p className="app-subtle-text text-[10px] font-semibold tracking-wide uppercase">Est. reach</p>
                    <p className="mt-1 font-medium">{creator.averageReach}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold">Why this creator matches</p>
                  <ul className="app-muted-text mt-2 space-y-2 text-sm">
                    {creator.reasons.map((reason) => (
                      <li key={reason} className="flex items-start gap-2"><span className="mt-1 grid size-4 shrink-0 place-items-center rounded-full bg-[#07988d] text-white"><span className="size-1 rounded-full bg-white" /></span>{reason}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#7257ff]/15 bg-[#7257ff]/5 p-3 text-xs text-[#5440bd]">
                  <CircleDollarSign className="size-4 shrink-0" />
                  Suggested: {creator.suggestedPayout}
                </div>

                <Button disabled variant="outline" className="mt-5 w-full">Sample profile · preview only</Button>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
