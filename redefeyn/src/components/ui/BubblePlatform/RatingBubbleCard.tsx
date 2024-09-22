"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Star, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RatingBubbleCardProps {
  businessName: string;
  rating: number;
  setRating: React.Dispatch<React.SetStateAction<number>>;
  categories: { name: string; badges: string[] }[];
  selectedBadges: { [key: string]: string[] };
  setSelectedBadges: React.Dispatch<
    React.SetStateAction<{ [key: string]: string[] }>
  >;
  toggleBadge: (categoryName: string, badge: string) => void;
  isLoading: boolean;
  isAlertDialogOpen: boolean;
  handleSaveReviewWithoutGenerate: () => void;
  handleGenerateReview: () => void;
  stopTimer: (categoryRatings: { [key: string]: number }) => void;
  sendingEmail: boolean;
  inStoreMode?: boolean;
}

export default function RatingBubbleCard({
  businessName,
  rating,
  setRating,
  categories,
  selectedBadges,
  setSelectedBadges,
  toggleBadge,
  isLoading,
  isAlertDialogOpen,
  handleSaveReviewWithoutGenerate,
  handleGenerateReview,
  stopTimer,
  sendingEmail,
  inStoreMode,
}: RatingBubbleCardProps) {
  const [categoryRatings, setCategoryRatings] = useState<{
    [key: string]: number;
  }>(Object.fromEntries(categories.map((category) => [category.name, 0])));

  const handleCategoryRating = (categoryName: string, newRating: number) => {
    setCategoryRatings((prev) => {
      // If the rating has changed, clear the selected badges for this category
      if (prev[categoryName] !== newRating) {
        setSelectedBadges((prevBadges) => ({
          ...prevBadges,
          [categoryName]: [], // Clear the badges for the category if rating changes
        }));
      }

      // Update the rating for the category
      return { ...prev, [categoryName]: newRating };
    });
  };

  const getBadgesForRating = (categoryName: string) => {
    // Find the category by name
    const category = categories.find((cat) => cat.name === categoryName);

    // Get the rating from the state for the given category
    const rating = categoryRatings[categoryName];

    // If the category and rating exist, find the matching badges for that rating
    if (category) {
      const matchedRating = category.badges.find(
        (badgeSet) => (badgeSet as any)["rating"] === rating,
      );
      return matchedRating ? (matchedRating as any).badges : [];
    }

    return [];
  };
  return (
    <Card className="w-full max-w-3xl border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-1 text-sm">
          {businessName}
        </CardTitle>
        <CardDescription className="flex items-center justify-center space-x-1 mb-2">
          {"How did we do? 🤔"}
        </CardDescription>
      </CardHeader>
      {isLoading ? (
        <CardContent>
          <div className="space-y-6">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="h-6 bg-muted rounded w-1/4 animate-pulse"></div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-5 w-5 bg-muted rounded-full animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      ) : (
        <CardContent>
          {categories.map((category) => (
            <div key={category.name} className="mb-6">
              <div className="flex items-center mb-2">
                <h3 className="text-sm font-semibold">{category.name}</h3>
                <div className="flex items-center space-x-1 ml-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 cursor-pointer ${
                        i < categoryRatings[category.name]
                          ? "text-primary fill-primary"
                          : "text-muted stroke-muted-foreground"
                      }`}
                      onClick={() => handleCategoryRating(category.name, i + 1)}
                    />
                  ))}
                </div>
              </div>

              {/* Map badges only for the current category */}
              <div className="flex flex-wrap gap-2">
                {getBadgesForRating(category.name).map((badge: any) => (
                  <Badge
                    key={badge}
                    variant={
                      selectedBadges[category.name]?.includes(badge)
                        ? "default"
                        : "outline"
                    }
                    className={`cursor-pointer transition-colors ${
                      selectedBadges[category.name]?.includes(badge)
                        ? categoryRatings[category.name] < 4
                          ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                        : ""
                    }`}
                    onClick={() => toggleBadge(category.name, badge)}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      )}
      <CardFooter className="flex justify-end">
        <AlertDialog open={isAlertDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {"We've got your feedback, Thank You! 🙌🏼"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {inStoreMode
                  ? "If you want, we can build a review, based on your selections, for you to post on Google Reviews for us. It would be really helpful! We'll send you it along with the review link!"
                  : "If you want, we can build a review, based on your selections, for you to post on Google Reviews for us. It would be really helpful! You'll just have to paste it!"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleSaveReviewWithoutGenerate}>
                {"No Thanks"}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleGenerateReview}>
                {"Let's do it"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <Button
          variant="ghost"
          disabled={Object.keys(selectedBadges).every(
            (key) => selectedBadges[key].length === 0,
          )}
          onClick={() => stopTimer(categoryRatings)}
        >
          <Send className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
