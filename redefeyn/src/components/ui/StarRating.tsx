"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StarRatingProps {
  onChange?: (rating: number) => void;
  initialRating?: number;
  title?: string;
}

export default function StarRating({
  onChange,
  initialRating = 0,
  title = "Rate your experience",
}: StarRatingProps) {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  const handleRating = (currentRating: number) => {
    setRating(currentRating);
    if (onChange) {
      onChange(currentRating);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={cn(
                "w-8 h-8 cursor-pointer transition-all duration-150",
                hover >= star || rating >= star
                  ? "text-primary fill-primary"
                  : "text-muted-foreground",
                hover >= star,
              )}
              onClick={() => handleRating(star)}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(0)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
