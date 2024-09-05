import { Skeleton } from "@/components/ui/skeleton";

export default function AnimatedTextareaSkeletonLoader() {
  return (
    <div className="w-full space-y-2">
      <Skeleton className="h-6 w-3/4 animate-pulse" />
      <Skeleton className="h-6 w-full animate-pulse animation-delay-200" />
      <Skeleton className="h-6 w-5/6 animate-pulse animation-delay-400" />
    </div>
  );
}
