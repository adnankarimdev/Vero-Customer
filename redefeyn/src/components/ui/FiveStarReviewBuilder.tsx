"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Send, StarIcon, Star } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Logo from "./Logo";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

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
  buisnessName: string;
  rating: number;
  placeId: string;
}

export default function FiveStarReviewBuilder({
  buisnessName,
  placeId,
}: FiveStarReviewBuilderProps) {
  const [selectedBadges, setSelectedBadges] = useState<SelectedBadges>({
    Service: [],
    Location: [],
    Coffee: [],
  });
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [generatedReview, setGeneratedReview] = useState("");
  const [categories, setCategories] = useState(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);
  const reviewUrl = `https://search.google.com/local/writereview?placeid=${placeId}`;
  const hasFetched = useRef(false);

  const toggleBadge = (category: string, badge: string) => {
    setSelectedBadges((prev) => {
      const categoryBadges = prev[category] || [];
      const updatedCategoryBadges = categoryBadges.includes(badge)
        ? categoryBadges.filter((b) => b !== badge)
        : [...categoryBadges, badge];

      return {
        ...prev,
        [category]: updatedCategoryBadges,
      };
    });
  };

  const handleGenerateReview = () => {
    const contextToSend =
      "Business Name: " +
      buisnessName +
      "\n" +
      "User Selected Badges " +
      JSON.stringify(selectedBadges);

    axios
      .post("http://localhost:8021/backend/generate-five-star-review/", {
        context: contextToSend,
      })
      .then((response) => {
        setGeneratedReview(response.data.content);
        setIsDialogOpen(true);
      })
      .catch((error) => {
        toast({
          title: "Failed",
          description: "Failed to generate review.",
        });
      });
  };

  const handlePostGeneratedReviewToGoogle = () => {
    navigator.clipboard
      .writeText(generatedReview)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description:
            "Your review has been copied to the clipboard! You can now paste it into the Google review form.",
        });
        setTimeout(() => {
          window.open(reviewUrl, "_blank", "noopener,noreferrer");
          window.location.reload();
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Review failed to Process",
          description: "It's not you, it's us. Please try again.",
        });
      });
  };
  useEffect(() => {
    const fetchCategories = async () => {
      if (hasFetched.current) return;

      hasFetched.current = true;

      const contextToSend = "Business Name: " + buisnessName;
      axios
        .post("http://localhost:8021/backend/generate-categories/", {
          context: contextToSend,
        })
        .then((response) => {
          const generatedCategories = response.data["content"]
            .replace(/```json/g, "")
            .replace(/```/g, "");
          console.log(generatedCategories);
          const generatedCategoriesAsJson = JSON.parse(generatedCategories);
          setCategories(generatedCategoriesAsJson["categories"]);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setCategories(defaultCategories);
          setIsLoading(false);
        });
    };

    fetchCategories();
  }, []);

  if (isDialogOpen) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Your Review</DialogTitle>
            <DialogDescription>Feel free to edit this! Once it looks good, click the Google icon below and it will copy the review for you to paste. 🥳</DialogDescription>

            <Textarea
              defaultValue={generatedReview}
              className="w-full min-h-[400px]"
              onChange={(e) => setGeneratedReview(e.target.value)}
            />
          </DialogHeader>
          <DialogFooter className="flex justify-between items-center">
            <Button
              type="submit"
              onClick={handlePostGeneratedReviewToGoogle}
              variant="ghost"
            >
              <FcGoogle size={24} />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Card className="w-full max-w-3xl mx-auto border-0">
      <CardHeader>
        <CardTitle className="flex items-center justify-center space-x-1 text-sm">
          {buisnessName}
        </CardTitle>
        <CardDescription className="flex items-center justify-center space-x-1 mb-2">
          {"We are glad so happy to hear that. Want to tell us why?"}
        </CardDescription>
        <div className="flex items-center justify-center space-x-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className={"text-primary fill-primary"} />
          ))}
        </div>
      </CardHeader>
      {isLoading ? (
        // Loader for the Card content and more
        <>
          <CardContent>
            <div className="flex items-center justify-center space-x-1 mb-6">
              {[...Array(5)].map((_, index) => (
                <div
                  key={index}
                  className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"
                ></div>
              ))}
            </div>
            {[...Array(3)].map((_, index) => (
              <div key={index} className="mb-6">
                <div className="h-6 bg-gray-300 rounded w-1/4 mb-2 animate-pulse"></div>
                <div className="flex flex-wrap gap-2">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="h-8 w-24 bg-gray-300 rounded animate-pulse"
                    ></div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end">
            <div className="h-10 w-24 bg-gray-300 rounded animate-pulse"></div>
          </CardFooter>
        </>
      ) : (
        <>
          <CardContent>
            {categories.map((category) => (
              <div key={category.name} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {category.badges.map((badge) => (
                    <Badge
                      key={badge}
                      variant={
                        selectedBadges[category.name]?.includes(badge)
                          ? "destructive"
                          : "outline"
                      }
                      className={
                        selectedBadges[category.name]?.includes(badge)
                          ? "bg-green-500 text-white hover:bg-green-500 hover:text-white cursor-pointer"
                          : "cursor-pointer transition-colors"
                      }
                      onClick={() => toggleBadge(category.name, badge)}
                    >
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
          <CardFooter className="flex justify-end">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  disabled={Object.keys(selectedBadges).every(
                    (key) => selectedBadges[key].length === 0,
                  )}
                >
                  <Send />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    We've got your feedback, Thank You! 🙌🏼
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {
                      "If you want, we can build a review, based on your selections, for you to post on Google Reviews for us. It would be really helpful! You'll just have to paste it!"
                    }
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>No Thanks</AlertDialogCancel>
                  <AlertDialogAction onClick={handleGenerateReview}>
                    Let's do it
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </>
      )}
    </Card>
  );
}
