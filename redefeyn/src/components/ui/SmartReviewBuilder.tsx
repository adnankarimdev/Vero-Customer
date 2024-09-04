"use client";

import React, { useState, useEffect } from "react";
import { RiAiGenerate } from "react-icons/ri";
import { FcGoogle } from "react-icons/fc";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CircleArrowRight, Send, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Place } from "../Types/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Block } from "../Types/types";
import Logo from "./Logo";
import FiveStarReviewBuilder from "./FiveStarReviewBuilder";

const categories = [
  {
    name: "Experience and Atmosphere",
    questions: [
      "What did you enjoy most about your visit to Phil and Sebastian? \n Did you try any of our specialty drinks? What did you think of them? \n Was the service at Phil and Sebastian up to your expectations?",
    ],
  },
];

interface SmartReviewProps {
  onChange?: (rating: number) => void;
  title?: string;
  id: string;
}

const SmartReviewBuilder = ({ onChange, id }: SmartReviewProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState("P&S");
  const [questions, setQuestions] = useState([
    {
      id: 1,
      questions: [
        "Could you tell us what went wrong during your visit to Phil and Sebastian?",
        "Was there a specific issue with our service or products that led to your dissatisfaction?",
        "How can we make things right and improve your experience for next time?",
      ],
    },
    {
      id: 2,
      questions: [
        "What aspects of your visit were disappointing, and how can we improve them?",
        "Were there any specific issues with our coffee, food, or service that we should address?",
        "Is there anything we could do differently to improve your overall experience?",
      ],
    },
    {
      id: 3,
      questions: [
        "What aspects of your experience at Phil and Sebastian could have been improved?",
        "Was there anything specific about our coffee or food that didn't meet your expectations?",
        "How was the service during your visit, and is there anything we could do to enhance it?",
      ],
    },
    {
      id: 4,
      questions: [
        "What did you enjoy the most about your visit to Phil and Sebastian?",
        "Is there one thing we could improve to turn your 4-star experience into a 5-star one?",
        "Were there any minor issues that you noticed during your visit that we could address?",
      ],
    },
    {
      id: 5,
      questions: [
        "What stood out the most during your visit to Phil and Sebastian?",
        "Did any of our specialty drinks or menu items leave a lasting impression?",
        "Is there anything else we can do to keep you coming back for more great experiences?",
      ],
    },
  ]);
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "text", content: "" },
  ]);
  const [reviews, setReviews] = useState<string[]>(
    new Array(categories.length).fill(""),
  );
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [isReviewComplete, setIsReviewComplete] = useState(false);
  const [sophisticatedReview, setSophisticatedReview] = useState("");
  const [userReviewScore, setUserReviewScore] = useState("");
  const [userReviewSophisticatedScore, setUserReviewSophisticatedScore] =
    useState("");
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWorryDialogOpen, setIsWorryDialogOpen] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [placeholder, setPlaceholder] = useState("✍🏻");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [showRatingsPage, setShowRatingsPage] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [worryRating, setWorryRating] = useState(1);
  const [worryDialog, setWorryDialog] = useState(false);
  const [worryBody, setWorryBody] = useState("");
  const [worryTitle, setWorryTitle] = useState("");
  const [usedReviewTemplate, setUsedReviewTemplate] = useState(false);

  useEffect(() => {
    const fetchReviewSettings = async (placeId = id) => {
      try {
        const response = await axios.get(
          `http://localhost:8021/backend/get-review-questions/${placeId}/`,
        );
        console.log("my questions", response.data);
        setQuestions(response.data.questions);
        setWorryRating(response.data.worryRating);
        setWorryDialog(response.data.showWorryDialog);
        setWorryBody(response.data.dialogBody);
        setWorryTitle(response.data.dialogTitle);
        const reviewPlace = response.data.places.find(
          (place: Place) => place.place_id === id,
        );
        setTitle(reviewPlace.name);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReviewSettings();
  }, []);

  const handleRating = (currentRating: number) => {
    setRating(currentRating);
    if (onChange) {
      onChange(currentRating);
    }
  };

  const handleRatingToReview = () => {
    setShowRatingsPage(false);
  };

  const handleReviewChange = (review: string) => {
    const newReviews = [...reviews];
    newReviews[currentStep] = review;
    setReviews(newReviews);
  };

  const handleGenerateReviewTemplate = () => {
    setUsedReviewTemplate(true);
    const contextToSend =
      "Business Name: " +
      title +
      "\n" +
      "User Rating: " +
      rating.toString() +
      "\n" +
      "Questions answering: " +
      "\n" +
      questions[rating - 1].questions.join("\n") +
      "\n";
    axios
      .post("http://localhost:8021/backend/generate-review-template/", {
        context: contextToSend,
      })
      .then((response) => {
        handleReviewChange(response.data.content);
      })
      .catch((error) => {
        toast({
          title: "Failed",
          description: "Failed to generate template.",
        });
      });
  };
  const handleNext = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!usedReviewTemplate) {
      const context =
        "User Rating:" +
        rating.toString() +
        " " +
        "Questions answering: " +
        questions[rating - 1].questions.join("\n") +
        "\n";
      const userReviews = context + "User Review Body:\n" + reviews.join("\n");
      axios
        .post("http://localhost:8021/backend/create-review-score/", {
          userReview: userReviews,
        })
        .then((response) => {
          setUserReviewScore(response.data.content);
          setIsReviewComplete(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      setIsReviewComplete(true);
    }
  };

  const handleSubmit = () => {
    const allReviews = reviews.join("\n");
    navigator.clipboard
      .writeText(allReviews)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description:
            "Your review has been copied to the clipboard! You can now paste it into the Google review form.",
        });
        setTimeout(() => {
          window.open(
            "https://search.google.com/local/writereview?placeid=ChIJzd0u2lRlcVMRoSTjaEEDL_E",
            "_blank",
            "noopener,noreferrer",
          );
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

  const handleSubmitSophisticated = () => {
    navigator.clipboard
      .writeText(sophisticatedReview)
      .then(() => {
        toast({
          title: "Copied to clipboard",
          description:
            "Your review has been copied to the clipboard! You can now paste it into the Google review form.",
        });
        setTimeout(() => {
          window.open(
            "https://search.google.com/local/writereview?placeid=ChIJzd0u2lRlcVMRoSTjaEEDL_E",
            "_blank",
            "noopener,noreferrer",
          );
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

  const handleSendReviewToBackend = () => {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };
  // const handleSophisticateReview = () => {
  //   const context =
  //     "User Rating:" +
  //     rating.toString() +
  //     " " +
  //     "Questions answering: " +
  //     questions[rating - 1].questions.join("\n") +
  //     "\n";
  //   const allReviews = context + "User Review body:\n" + reviews.join("\n");
  //   axios
  //     .post("http://localhost:8021/backend/create-review/", {
  //       allReviewsToSend: allReviews,
  //     })
  //     .then((response) => {
  //       setSophisticatedReview(response.data.content);
  //       setUserReviewSophisticatedScore(
  //         (Math.floor(Math.random() * (100 - 90 + 1)) + 90).toString(),
  //       );
  //       setIsDialogOpen(true);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  const sendEmail = () => {
    const context =
      "User Rating:" +
      rating.toString() +
      " " +
      "Questions answering: " +
      questions[rating - 1].questions.join("\n") +
      "\n";
    const userReviews = context + "User Review Body:\n" + reviews.join("\n");
    axios
      .post("http://localhost:8021/backend/send-email/", {
        userEmailToSend: userEmail,
        userNameToSend: userName,
        userReviewToSend: userReviews,
      })
      .then((response) => {
        setIsWorryDialogOpen(false);
        toast({
          title: "Email Sent",
          description: "Thank you for giving us a chance to make things right.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        toast({
          title: "Error",
          description: "Failed to send email.",
        });
      });
  };

  const closeWorryDialog = () => {
    setIsWorryDialogOpen(false);
  };
  if (isDialogOpen) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Redefeyned Review</DialogTitle>

            <Textarea
              defaultValue={sophisticatedReview}
              className="w-full min-h-[400px]"
              onChange={(e) => setSophisticatedReview(e.target.value)}
            />
          </DialogHeader>
          <DialogFooter className="flex justify-between items-center">
            <div className="flex-1">
              <Badge variant="outline">
                New Review Score: {userReviewSophisticatedScore}
              </Badge>
            </div>
            {/* <Button
              type="submit"
              onClick={handleSubmitSophisticated}
              variant="ghost"
            >
              <FcGoogle size={24} />
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  const handleWorryRatingDialog = () => {
    setIsWorryDialogOpen(false);
  };

  if (isReviewComplete) {
    return (
      <div>
        <Card className="w-relative max-w-3xl mx-auto">
          <CardHeader className="flex justify-center items-center relative">
            <CardTitle>Your Review</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center relative">
            {categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <p>{reviews[index]}</p>
              </div>
            ))}
            <div className="flex justify-center"></div>
          </CardContent>
          <CardFooter className="flex justify-end">
            {
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost">
                    <Send />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Thank you!</AlertDialogTitle>
                    <AlertDialogDescription>
                      {
                        "Feedback receieved. We will integrate the feedback you suggested. We hope you decide to come back one day and your rating goes from a "
                      }{" "}
                      {rating} {"to a 5."}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSendReviewToBackend}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            }
            {/* <Button onClick={handleSubmit} variant="ghost">
              <FcGoogle size={24} />
            </Button> */}
          </CardFooter>
        </Card>
        {rating <= worryRating && worryDialog && (
          <Dialog
            open={isWorryDialogOpen}
            onOpenChange={handleWorryRatingDialog}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex justify-center items-center">
                  {worryTitle}
                </DialogTitle>
                <DialogDescription>{worryBody}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    className="col-span-3"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    className="col-span-3"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter className="flex justify-between">
                <Button
                  type="button"
                  onClick={closeWorryDialog}
                  className="mr-auto"
                  variant="outline"
                >
                  Use current review
                </Button>
                <Button
                  type="submit"
                  onClick={sendEmail}
                  className="ml-auto"
                  variant="outline"
                >
                  Send Email
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  return (
    <div>
      {showRatingsPage && (
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
                      hover >= star,
                    )}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                  />
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="ghost">
                <CircleArrowRight onClick={handleRatingToReview} />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
      {!showRatingsPage && rating == 5 && (
        <FiveStarReviewBuilder
          buisnessName={title}
          rating={rating}
          placeId={id}
        />
      )}
      {!showRatingsPage && rating <= 4 && (
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          <p className="text-3xl font-bold">{title || "Untitled"}</p>
          <div className="max mx-auto p-6 bg-white rounded-lg shadow-sm">
            <ul className="space-y-4">
              {questions[rating - 1].questions.map((item, index) => (
                <li
                  key={index}
                  className="flex items-start space-x-3 transition-opacity duration-300 ease-in-out"
                  style={{
                    opacity:
                      hoveredIndex === null || hoveredIndex === index ? 1 : 0.5,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-gray-400" />
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-grow">
            <Textarea
              value={reviews[currentStep]}
              onFocus={() => setPlaceholder("")} // Clear placeholder on focus
              onBlur={() => setPlaceholder(reviews[currentStep] ? "" : "✍🏻")}
              onChange={(e) => handleReviewChange(e.target.value)}
              className={
                placeholder == ""
                  ? "w-full border-none outline-none"
                  : "w-full border-none outline-none text-center"
              }
              style={{ resize: "none" }}
              rows={3}
              placeholder={placeholder}
            />
          </div>

          <div className="flex justify-between items-center w-full">
            {currentStep === categories.length - 1 ? (
              <div className="flex w-full">
                {/* <Button variant="ghost" onClick={handleGenerateReviewTemplate}>
        <RiAiGenerate size={24} className="mr-2"/> 
        {"Generate Review Template"}
      </Button> */}
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    {/* <Button variant="ghost">
                      <RiAiGenerate size={24} className="mr-2" />{" "}
                    </Button> */}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Generate a Review Template
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {
                          "This will generate a review template for your rating of "
                        }{" "}
                        {rating}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleGenerateReviewTemplate}>
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <div className="flex-grow"></div>{" "}
                {/* This takes up remaining space */}
                <Button variant="ghost" onClick={handleNext}>
                  <Send />
                </Button>
              </div>
            ) : (
              <CircleArrowRight />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartReviewBuilder;
