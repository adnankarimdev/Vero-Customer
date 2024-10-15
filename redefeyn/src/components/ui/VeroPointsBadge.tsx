import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VeroPointsBadgeProps {
  score: number;
}

export default function VeroPointsBadge({ score }: VeroPointsBadgeProps) {
  return (
    <Badge
      className={cn(
        "bg-gradient-to-r from-purple-500 to-purple-700 text-white font-bold  mt-4",
      )}
    >
      {"Vero Points: "}
      {score}
    </Badge>
  );
}
