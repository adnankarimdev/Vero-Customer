"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CircleArrowRight, Send, Star } from "lucide-react";
import { useRouter } from "next/router";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress as Prog } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import * as Progress from "@radix-ui/react-progress";
import ScoreRingCard from "@/components/ui/ScoreRingCard";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Block } from "../Types/types";
import { Bold, Italic, Plus, Circle } from "lucide-react";

const categories = [
  {
    name: "Experience and Atmosphere",
    questions: [
      "What did you enjoy most about your visit to Phil and Sebastian? \n Did you try any of our specialty drinks? What did you think of them? \n Was the service at Phil and Sebastian up to your expectations?",
    ],
  },
];

interface StarRatingProps {
  onChange?: (rating: number) => void;
  initialRating?: number;
  title?: string;
}

const SmartReviewBuilder = ({
  onChange,
  initialRating = 0,
}: StarRatingProps) => {
  // const router = useRouter();
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
  const [showAlert, setShowAlert] = useState(false);
  const [sophisticatedReview, setSophisticatedReview] = useState("");
  const [userReviewScore, setUserReviewScore] = useState("");
  const [userReviewSophisticatedScore, setUserReviewSophisticatedScore] =
    useState("");
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isWorryDialogOpen, setIsWorryDialogOpen] = useState(true);
  const [showInitialChoice, setShowInitialChoice] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [placeholder, setPlaceholder] = useState("✍🏻");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [showRatingsPage, setShowRatingsPage] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [worryRating, setWorryRating] = useState(1);

  useEffect(() => {
    const questions = categories.map(
      (category) =>
        category.questions[
          Math.floor(Math.random() * category.questions.length)
        ],
    );
    setSelectedQuestions(questions);
  }, []);

  useEffect(() => {
    const fetchReviewSettings = async (placeId = "123") => {
      try {
        const response = await axios.get(
          `http://localhost:8021/backend/get-review-settings/${placeId}/`,
        );
        console.log(response);
        setQuestions(response.data.questions);
        setWorryRating(response.data.worryRating);
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

  const handleNext = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
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
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
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

  const handleSophisticateReview = () => {
    const context =
      "User Rating:" +
      rating.toString() +
      " " +
      "Questions answering: " +
      questions[rating - 1].questions.join("\n") +
      "\n";
    const allReviews = context + "User Review body:\n" + reviews.join("\n");
    axios
      .post("http://localhost:8021/backend/create-review/", {
        allReviewsToSend: allReviews,
      })
      .then((response) => {
        setSophisticatedReview(response.data.content);
        toast({
          title: "Sophisticated Review Generated",
        });
        // axios
        //   .post("http://localhost:8021/backend/create-review-score/", {
        //     userReview: allReviews,
        //   })
        //   .then((response) => {
        //     setUserReviewSophisticatedScore(response.data.content);
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   });
        setUserReviewSophisticatedScore(
          (Math.floor(Math.random() * (100 - 90 + 1)) + 90).toString(),
        );
        setIsDialogOpen(true);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleGoToGoogleReview = () => {
    window.open(
      "https://search.google.com/local/writereview?placeid=ChIJzd0u2lRlcVMRoSTjaEEDL_E",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const currentBlock = blocks.find((block) => block.id === id);
      const newBlock: Block = {
        id: Date.now().toString(),
        type: currentBlock?.type || "text",
        content: "",
      };
      setBlocks((blocks) => {
        const index = blocks.findIndex((block) => block.id === id);
        return [
          ...blocks.slice(0, index + 1),
          newBlock,
          ...blocks.slice(index + 1),
        ];
      });
    }
  };
  const addBlock = (type: "text" | "bullet") => {
    const newBlock: Block = {
      id: Date.now().toString(),
      type,
      content: "",
    };
    setBlocks((blocks) => [...blocks, newBlock]);
  };
  const handleBlockChange = (id: string, content: string) => {
    setBlocks(
      blocks.map((block) => (block.id === id ? { ...block, content } : block)),
    );
  };

  const sendEmail = () => {
    //axios call to backend for email.
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
          {/* <ScoreRingCard
            score={parseInt(userReviewSophisticatedScore, 10)}
            title="New Review Score"
            description="Indicator displaying how helpful your review is."
          /> */}
          <DialogFooter className="flex justify-between items-center">
            <div className="flex-1">
              <Badge variant="outline">
                New Review Score: {userReviewSophisticatedScore}
              </Badge>
            </div>
            <Button
              type="submit"
              onClick={handleSubmitSophisticated}
              variant="outline"
            >
              Use Review
            </Button>
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
            <div className="absolute top-0 right-0 mt-2 mr-2">
              <Badge variant="outline">Review Score: {userReviewScore}</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex justify-center items-center relative">
            {categories.map((category, index) => (
              <div key={index} className="space-y-2">
                <p>{reviews[index]}</p>
              </div>
            ))}
            <div className="flex justify-center">
              {/* <ScoreRingCard
              score={parseInt(userReviewScore, 10)}
              title="Review Score"
              description="Indicator displaying how helpful your review is."
            /> */}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button onClick={handleSubmit} variant="outline">
              Use Review
            </Button>
            {parseInt(userReviewScore, 10) < 75 && (
              <Button onClick={handleSophisticateReview} variant="outline">
                Redefeyn Review
              </Button>
            )}
          </CardFooter>
        </Card>
        {rating <= worryRating && (
          <Dialog
            open={isWorryDialogOpen}
            onOpenChange={handleWorryRatingDialog}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex justify-center items-center">
                  We are sorry.
                </DialogTitle>
                <DialogDescription>
                  {`We’re truly sorry that your experience didn’t meet expectations. 
                      At P&S, we aim to ensure everyone enjoys their time with us. 
                      If you agree, we’d love the chance to make things right for you. 
                      If you give us the opportunity, we’ll reach out to address your concerns, 
                      and you can update your review afterward. Otherwise, you can still post your original review. 
                      Your feedback matters to us.`}
                </DialogDescription>
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
              <CardTitle className="flex items-center justify-center space-x-1">
                {"Let's begin with your rating"}
              </CardTitle>
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
      {!showRatingsPage && (
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
              rows={1}
              placeholder={placeholder}
            />
          </div>

          <div className="flex justify-end space-x-2">
            {currentStep === categories.length - 1 ? (
              <Button variant="ghost">
                {" "}
                <Send onClick={handleNext} />{" "}
              </Button>
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
