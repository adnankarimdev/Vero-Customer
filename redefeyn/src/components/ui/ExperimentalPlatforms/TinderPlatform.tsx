"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { Badge } from "@/components/ui/badge";
import { CustomerReviewInfo } from "../../Types/types";
import { Send, Star } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { motion, useAnimation, PanInfo } from "framer-motion";

const defaultCategories = [
  {
    name: "Customer Service",
    badges: [
      "Friendly staff",
      "Quick service",
      "Attentive",
      "Knowledgeable",
      "Accommodating",
    ],
  },
  {
    name: "Ambiance and Environment",
    badges: [
      "Cozy atmosphere",
      "Great view",
      "Convenient parking",
      "Quiet area",
      "Outdoor seating",
    ],
  },
  {
    name: "Quality of Items",
    badges: [
      "Rich flavor",
      "Perfect temperature",
      "Great variety",
      "Ethically sourced",
      "Unique blends",
    ],
  },
];

type SelectedBadges = {
  [key: string]: string[];
};

interface FiveStarReviewBuilderProps {
  businessName: string;
  rating: number;
  placeId: string;
  keywords?: string[];
  worryRating: number;
  inStoreMode?: boolean;
}

export default function TinderFiveStarReviewBuilder({
  businessName,
  placeId,
  rating,
  keywords,
  worryRating,
  inStoreMode,
}: FiveStarReviewBuilderProps) {
  const router = useRouter();
  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
  const [selectedBadges, setSelectedBadges] = useState<SelectedBadges>({});
  const [categories, setCategories] = useState(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [currentBadgeIndex, setCurrentBadgeIndex] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    startTimer();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    // Simulating API call with a timeout
    setTimeout(() => {
      setCategories(defaultCategories);
      setIsLoading(false);
    }, 1500);
  };

  const startTimer = () => {
    startTimeRef.current = Date.now();
  };

  const stopTimer = () => {
    if (startTimeRef.current === null) return;
    endTimeRef.current = Date.now();
    const duration = (endTimeRef.current - startTimeRef.current) / 1000;
    handleSaveReview(duration);
  };

  const handleSaveReview = async (duration: number) => {
    setIsLoading(true);
    const allBadges: string[] = Object.values(selectedBadges).flat();
    const dataToSave: CustomerReviewInfo = {
      location: businessName,
      rating: rating,
      placeIdFromReview: placeId,
      badges: allBadges,
      postedToGoogleReview: false,
      generatedReviewBody: "",
      finalReviewBody: "",
      emailSentToCompany: false,
      timeTakenToWriteReview: duration,
      reviewDate: new Date().toISOString(),
      postedWithBubbleRatingPlatform: rating > worryRating || inStoreMode,
      postedWithInStoreMode: inStoreMode,
      reviewUuid: uuidv4(),
    };

    try {
      await axios.post("https://vero.ngrok.dev/backend/save-customer-review/", {
        data: dataToSave,
      });
      if (inStoreMode) {
        // Handle in-store mode
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        router.push("/thankyou");
      }
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const swipeThreshold = 100;
    if (info.offset.x > swipeThreshold) {
      handleLike();
    } else if (info.offset.x < -swipeThreshold) {
      handleDislike();
    } else {
      controls.start({
        x: 0,
        transition: { type: "spring", stiffness: 300, damping: 20 },
      });
    }
  };

  const handleLike = () => {
    const currentCategory = categories[currentCategoryIndex];
    const currentBadge = currentCategory.badges[currentBadgeIndex];
    setSelectedBadges((prev) => ({
      ...prev,
      [currentCategory.name]: [
        ...(prev[currentCategory.name] || []),
        currentBadge,
      ],
    }));
    nextBadge();
  };

  const handleDislike = () => {
    nextBadge();
  };

  const nextBadge = () => {
    if (
      currentBadgeIndex <
      categories[currentCategoryIndex].badges.length - 1
    ) {
      setCurrentBadgeIndex(currentBadgeIndex + 1);
    } else if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
      setCurrentBadgeIndex(0);
    } else {
      // All badges have been shown
      stopTimer();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md border-0">
          <CardContent className="flex flex-col items-center justify-center p-6">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentCategory = categories[currentCategoryIndex];
  const currentBadge = currentCategory.badges[currentBadgeIndex];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            {businessName}
          </CardTitle>
          <CardDescription className="text-center mb-2">
            {rating <= 4
              ? "Want to tell us why?"
              : "We are so happy to hear that. 🥳 Want to tell us why?"}
          </CardDescription>
          <div className="flex items-center justify-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-5 h-5",
                  i < rating
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-gray-300",
                )}
              />
            ))}
          </div>
        </CardHeader>
        <CardContent>
          <h3 className="text-lg font-semibold mb-4 text-center">
            {currentCategory.name}
          </h3>
          <motion.div
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            className="cursor-grab active:cursor-grabbing"
          >
            <Badge
              variant="outline"
              className={cn(
                "text-lg p-4 w-full text-center",
                selectedBadges[currentCategory.name]?.includes(currentBadge)
                  ? rating < 4
                    ? "bg-red-100 text-red-800"
                    : "bg-green-100 text-green-800"
                  : "bg-white",
              )}
            >
              {currentBadge}
            </Badge>
          </motion.div>
          <div className="flex justify-between mt-4">
            <Button variant="outline" onClick={handleDislike}>
              👎 Dislike
            </Button>
            <Button variant="outline" onClick={handleLike}>
              👍 Like
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant="ghost"
            onClick={stopTimer}
            disabled={Object.keys(selectedBadges).every(
              (key) => selectedBadges[key].length === 0,
            )}
          >
            <Send className="mr-2" />
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
