import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, CircleArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  handleRating: (rating: number) => void;
  handleRatingToReview: () => void;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  handleRating,
  handleRatingToReview,
}) => {
  const [hover, setHover] = useState<number>(0);

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-center space-x-1 text-lg">
            {"Hello, you 😇"}
          </CardTitle>
          <CardDescription className="flex items-center justify-center space-x-1">
            {"Let's begin with your rating"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  "w-8 h-8 cursor-pointer transition-all duration-150",
                  hover >= star || rating >= star
                    ? "text-primary fill-primary"
                    : "text-muted-foreground",
                )}
                onClick={() => handleRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              />
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="ghost" onClick={handleRatingToReview}>
            <CircleArrowRight />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default StarRating;
