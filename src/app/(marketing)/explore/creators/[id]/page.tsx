import { notFound } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCreatorById } from "@/server/db/read";

type Props = { params: Promise<{ id: string }> };

export default async function CreatorDetailPage({ params }: Props) {
  const { id } = await params;
  const creator = await getCreatorById(id);

  if (!creator) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 md:px-8">
      <Card className="border-zinc-200/80 bg-white/95">
        <CardHeader>
          <CardTitle className="text-2xl">{creator.display_name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-zinc-700">
          <p>{creator.bio || "No bio yet."}</p>
          <p>Niches: {(creator.niches as string[]).join(", ") || "n/a"}</p>
          <div>
            <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Channels
            </h3>
            <pre className="rounded-lg bg-zinc-950/95 p-4 text-xs text-zinc-100">
              {JSON.stringify(creator.channels, null, 2)}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
