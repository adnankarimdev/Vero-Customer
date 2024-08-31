import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoreRingCardProps {
  score: number;
  title: string;
  description?: string;
}

const getColorClass = (score: number): string => {
  if (score >= 90) return "text-emerald-500";
  if (score >= 80) return "text-green-500";
  if (score >= 70) return "text-lime-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 50) return "text-amber-500";
  if (score >= 40) return "text-orange-500";
  if (score >= 30) return "text-red-500";
  if (score >= 20) return "text-rose-500";
  return "text-pink-500";
};

const ScoreRingCard: React.FC<ScoreRingCardProps> = ({
  score,
  title,
  description,
}) => {
  // Ensure the score is between 0 and 100
  const normalizedScore = Math.min(Math.max(Math.round(score), 0), 100);

  // Calculate the stroke dash array and offset for the progress ring
  const circumference = 2 * Math.PI * 45; // 45 is the radius of our circle
  const strokeDasharray = `${circumference} ${circumference}`;
  const strokeDashoffset =
    circumference - (normalizedScore / 100) * circumference;

  const colorClass = getColorClass(normalizedScore);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-center">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-48 h-48">
          {/* Background circle */}
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              className="text-muted stroke-current"
              strokeWidth="10"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            {/* Foreground circle */}
            <circle
              className={`${colorClass} stroke-current`}
              strokeWidth="10"
              strokeLinecap="round"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              style={{
                strokeDasharray,
                strokeDashoffset,
                transform: "rotate(-90deg)",
                transformOrigin: "50% 50%",
                transition: "stroke-dashoffset 0.5s ease-in-out",
              }}
            />
          </svg>
          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-4xl font-bold ${colorClass}`}>
              {normalizedScore}
            </span>
            <span className="text-sm text-muted-foreground">out of 100</span>
          </div>
        </div>
        {description && (
          <p className="mt-4 text-center text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default ScoreRingCard;
