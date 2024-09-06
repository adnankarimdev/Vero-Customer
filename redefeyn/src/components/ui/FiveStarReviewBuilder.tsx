"use client";

import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { CustomerReviewInfo } from "../Types/types";
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
  keywords?: string[];
}

export default function FiveStarReviewBuilder({
  buisnessName,
  placeId,
  rating,
  keywords,
}: FiveStarReviewBuilderProps) {
  const startTimeRef = useRef<number | null>(null);
  const endTimeRef = useRef<number | null>(null);
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
  const [initialGeneratedRevieBody, setInitialGeneratedReviewBody] =
    useState("");
  const [timeTakenToWriteReview, setTimeTakenToWriteReview] = useState(0);

  const formatDate = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
      month: "long", // 'long' for full month name (e.g., 'September')
      day: "numeric", // numeric day of the month (e.g., 5)
      year: "numeric", // numeric year (e.g., 2024)
      hour: "2-digit", // 2-digit hour (e.g., 14 for 2 PM)
      minute: "2-digit", // 2-digit minute (e.g., 30)
      second: "2-digit", // 2-digit second (e.g., 00)
      hour12: true, // use 24-hour time format
    };

    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

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
    setIsLoading(true);
    const contextToSend =
      "Business Name:\n" +
      buisnessName +
      "\n" +
      "User Selected Badges:\n" +
      JSON.stringify(selectedBadges) +
      "\n" +
      "Keywords:\n" +
      JSON.stringify(keywords);

    axios
      .post("http://localhost:8021/backend/generate-five-star-review/", {
        context: contextToSend,
      })
      .then((response) => {
        setGeneratedReview(response.data.content);
        setInitialGeneratedReviewBody(response.data.content);
        setIsDialogOpen(true);
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Failed",
          description: "Failed to generate review. Could you try again? 🥺",
        });
        setIsLoading(false);
      });
  };

  const handleSaveReviewWithoutGenerate = async () => {
    //send data to backend to process.
    setIsLoading(true);
    const allBadges: string[] = Object.values(selectedBadges).flat();
    const dataToSave: CustomerReviewInfo = {
      location: buisnessName,
      rating: rating,
      placeIdFromReview: placeId,
      badges: allBadges,
      postedToGoogleReview: false,
      generatedReviewBody: "",
      finalReviewBody: "",
      emailSentToCompany: false,
      timeTakenToWriteReview: timeTakenToWriteReview,
      reviewDate: formatDate(new Date()),
    };
    await axios
      .post("http://localhost:8021/backend/save-customer-review/", {
        data: dataToSave,
      })
      .then((response) => {
        //  setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        //  setIsLoading(false);
      });

    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  const handlePostGeneratedReviewToGoogle = async () => {
    //send data to backend to process.
    setIsLoading(true);
    const allBadges: string[] = Object.values(selectedBadges).flat();
    const dataToSave: CustomerReviewInfo = {
      location: buisnessName,
      rating: rating,
      placeIdFromReview: placeId,
      badges: allBadges,
      postedToGoogleReview: true,
      generatedReviewBody: initialGeneratedRevieBody,
      finalReviewBody: generatedReview,
      emailSentToCompany: false,
      timeTakenToWriteReview: timeTakenToWriteReview,
      reviewDate: formatDate(new Date()),
    };
    await axios
      .post("http://localhost:8021/backend/save-customer-review/", {
        data: dataToSave,
      })
      .then((response) => {
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
    navigator.clipboard
      .writeText(generatedReview)
      .then(() => {
        toast({
          title: "Your text is ready to paste!",
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
    startTimer();
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

  const startTimer = () => {
    startTimeRef.current = Date.now();
    console.log("Timer started");
  };

  const stopTimer = () => {
    if (startTimeRef.current === null) {
      console.log("Timer was not started");
      return;
    }
    endTimeRef.current = Date.now();
    const duration = (endTimeRef.current - startTimeRef.current) / 1000;
    console.log(`Timer stopped after ${duration} seconds`);
    setTimeTakenToWriteReview(duration);
  };

  if (isDialogOpen) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle className="text-center">
              Your review is ready to take the spotlight! 🌟
            </DialogTitle>
            <DialogDescription className="text-center">
              Feel free to edit this! Once it looks good, click the Google icon
              below and it will copy the review for you to paste 🥳
            </DialogDescription>

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
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-3xl border-0">
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
                  <h3 className="text-lg font-semibold mb-2">
                    {category.name}
                  </h3>
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
                    onClick={stopTimer}
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
                    <AlertDialogCancel
                      onClick={handleSaveReviewWithoutGenerate}
                    >
                      No Thanks
                    </AlertDialogCancel>
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
    </div>
  );
}
