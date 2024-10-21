import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface VeroGlobalBadgeProps {
  score: number;
}

export default function VeroGlobalBadge({ score }: VeroGlobalBadgeProps) {
  return (
    <Badge
      className={cn(
        "bg-gradient-to-r from-blue-500 to-blue-700 text-white font-bold mt-4 text-lg sm:text-sm",
      )}
    >
      {"Vero Global Limit: "}
      {score}
    </Badge>
  );
}
