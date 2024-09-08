"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CustomerReviewInfo } from "../Types/types";
import { RiAiGenerate } from "react-icons/ri";
import { Send, StarIcon, Star, Mail } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import Logo from "./Logo";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import EmailSkeleton from "./Skeletons/EmailSkeleton";
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
  worryRating: number;
  worryBody?: string;
  worryTitle?: string;
  bubbleRatingPlatform?: boolean;
  showEmailWorryDialog?: boolean;
}

export default function FiveStarReviewBuilder({
  buisnessName,
  placeId,
  rating,
  keywords,
  worryBody,
  worryTitle,
  bubbleRatingPlatform,
  showEmailWorryDialog,
  worryRating,
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
  const [sendingEmail, setIsSendingEmail] = useState(false);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isWorryDialogOpen, setIsWorryDialogOpen] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const [worryDialog, setWorryDialog] = useState(false);

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
      "User Rating:\n" +
      rating +
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
        setIsAlertDialogOpen(false);
        setIsDialogOpen(true);
        setIsLoading(false);
      })
      .catch((error) => {
        toast({
          title: "Failed",
          description: "Failed to generate review. Could you try again? 🥺",
          duration: 1000,
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
      postedWithBubbleRatingPlatform:
        rating > worryRating ? true : bubbleRatingPlatform,
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
  const handleWorryRatingDialog = async () => {
    setIsWorryDialogOpen(false);
    setIsSendingEmail(true);
    const allBadges: string[] = Object.values(selectedBadges).flat();
    //save data here
    const dataToSave: CustomerReviewInfo = {
      location: buisnessName,
      rating: rating,
      placeIdFromReview: placeId,
      badges: allBadges,
      postedToGoogleReview: false,
      generatedReviewBody: initialGeneratedRevieBody,
      finalReviewBody: generatedReview,
      emailSentToCompany: false,
      timeTakenToWriteReview: timeTakenToWriteReview,
      reviewDate: formatDate(new Date()),
      postedWithBubbleRatingPlatform:
        rating > worryRating ? true : bubbleRatingPlatform,
    };
    await axios
      .post("http://localhost:8021/backend/save-customer-review/", {
        data: dataToSave,
      })
      .then((response) => {
        // setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // setIsLoading(false);
      });
    toast({
      title: "Thank you for your feedback!",
      duration: 1000,
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  const handlePostGeneratedReviewToGoogle = async () => {
    //send data to backend to process.
    console.log("rating", rating);
    console.log("worryrating", worryRating);
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
      postedWithBubbleRatingPlatform:
        rating > worryRating ? true : bubbleRatingPlatform,
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
          duration: 1000,
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
          duration: 1000,
        });
      });
  };
  useEffect(() => {
    startTimer();
    const fetchCategories = async () => {
      if (hasFetched.current) return;

      hasFetched.current = true;

      const contextToSend =
        "Business Name: " + buisnessName + "\n" + "User Rating: " + rating;
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

  const sendEmail = async () => {
    setIsSendingEmail(true);
    const allBadges: string[] = Object.values(selectedBadges).flat();
    //save data here
    const dataToSave: CustomerReviewInfo = {
      location: buisnessName,
      rating: rating,
      placeIdFromReview: placeId,
      badges: allBadges,
      postedToGoogleReview: false,
      generatedReviewBody: initialGeneratedRevieBody,
      finalReviewBody: generatedReview,
      emailSentToCompany: true,
      timeTakenToWriteReview: timeTakenToWriteReview,
      reviewDate: formatDate(new Date()),
      postedWithBubbleRatingPlatform:
        rating > worryRating ? true : bubbleRatingPlatform,
    };
    await axios
      .post("http://localhost:8021/backend/save-customer-review/", {
        data: dataToSave,
      })
      .then((response) => {
        // setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        // setIsLoading(false);
      });
    const context =
      "User Rating:" +
      rating.toString() +
      " " +
      "Questions answering: \n" +
      "No questions given" +
      "\n";
    const userReviews =
      context + "User Review Selected Badges:\n" + allBadges.join("\n");
    axios
      .post("http://localhost:8021/backend/send-email/", {
        userEmailToSend: userEmail,
        userNameToSend: userName,
        userReviewToSend: userReviews,
        buisnessName: buisnessName,
      })
      .then((response) => {
        setIsSendingEmail(false);
        setIsWorryDialogOpen(false);
        toast({
          className: cn(
            "top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4",
          ),
          title: "Email Sent",
          description: "Thank you for giving us a chance to make things right.",
          duration: 1000,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        setIsSendingEmail(false);
        toast({
          title: "Error",
          description: "Failed to send email.",
          duration: 1000,
        });
      });
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

    if (rating <= worryRating && showEmailWorryDialog) {
      setIsWorryDialogOpen(true);
    } else if (rating > worryRating) {
      setIsAlertDialogOpen(true);
    }
    // no email dialog by client, make sure to save the badges.
    else {
      handleWorryRatingDialog();
    }
  };

  const handleGoogleReviewDialogChange = () =>
  {
    handleSaveReviewWithoutGenerate()
    setIsDialogOpen(false)
  }
  if (isDialogOpen) {
    if (rating > worryRating) {
      return (
        <Dialog open={isDialogOpen} onOpenChange={handleGoogleReviewDialogChange}>
          <DialogContent className="w-full">
            <DialogHeader>
              <DialogTitle className="text-center">
                Your review is ready to take the spotlight! 🌟
              </DialogTitle>
              <DialogDescription className="text-center">
                Feel free to edit this! Once it looks good, click the Google
                icon below and it will copy the review for you to paste 🥳
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
  }

  if (isWorryDialogOpen && showEmailWorryDialog) {
    return (
      <Dialog open={isWorryDialogOpen} onOpenChange={handleWorryRatingDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex justify-center items-center">
              {worryTitle}
            </DialogTitle>
            <DialogDescription>{worryBody}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className="text-left">
                Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-left">
                Email
              </Label>
              <Input
                id="email"
                className="w-full"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />
            </div>

            <div className="">
              <Label htmlFor="text" className="text-right">
                Personalized Feedback
              </Label>
              <Button
                type="submit"
                onClick={handleGenerateReview}
                className="ml-auto"
                variant="ghost"
              >
                <RiAiGenerate />
              </Button>
              <Textarea
                defaultValue={generatedReview}
                className="w-full min-h-[400px]"
                onChange={(e) => setGeneratedReview(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex justify-end">
            <Button
              type="submit"
              onClick={sendEmail}
              className="ml-auto"
              variant="ghost"
            >
              <Mail />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {sendingEmail && <EmailSkeleton />}
      {!sendingEmail && (
        <Card className="w-full max-w-3xl border-0">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-1 text-sm">
              {buisnessName}
            </CardTitle>
            <CardDescription className="flex items-center justify-center space-x-1 mb-2">
              {rating <= 4 && "Want to tell us why?"}
              {rating == 5 &&
                "We are so happy to hear that. 🥳 Want to tell us why?"}
            </CardDescription>
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < rating ? "text-black fill-black" : "text-gray-300"}`}
                />
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
                              ? rating < 4
                                ? "bg-red-500 text-white hover:bg-red-500 hover:text-white cursor-pointer"
                                : "bg-green-500 text-white hover:bg-green-500 hover:text-white cursor-pointer"
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
                <AlertDialog open={isAlertDialogOpen}>
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
                <Button
                  variant="ghost"
                  disabled={Object.keys(selectedBadges).every(
                    (key) => selectedBadges[key].length === 0,
                  )}
                  onClick={stopTimer}
                >
                  <Send />
                </Button>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  );
}
