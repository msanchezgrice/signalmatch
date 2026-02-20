import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingCreators() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-10 md:px-8">
      <Skeleton className="mb-6 h-10 w-72" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <Skeleton key={idx} className="h-44 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
