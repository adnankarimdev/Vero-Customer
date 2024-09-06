import { Skeleton } from "@/components/ui/skeleton";

export default function EmailSkeleton() {
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-6 bg-card rounded-lg shadow-md">
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
        </div>

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>

      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-24" />
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-muted animate-pulse" />
          <div
            className="w-3 h-3 rounded-full bg-muted animate-pulse"
            style={{ animationDelay: "300ms" }}
          />
          <div
            className="w-3 h-3 rounded-full bg-muted animate-pulse"
            style={{ animationDelay: "600ms" }}
          />
        </div>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Sending email... Please wait.
      </p>
    </div>
  );
}
