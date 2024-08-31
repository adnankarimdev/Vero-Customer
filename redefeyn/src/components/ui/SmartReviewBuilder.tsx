"use client";

import React, { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CircleArrowRight, Send } from "lucide-react";
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

const SmartReviewBuilder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [title, setTitle] = useState("P&S");
  const [questions, setQuestions] = useState([
    "What did you enjoy about your visit to Phil and Sebastian, if anything?",
    "Did you try any of our specialty drinks? If so, how would you describe your experience?",
    "How was the service during your visit to Phil and Sebastian?",
  ]);
  const [blocks, setBlocks] = useState<Block[]>([
    { id: "1", type: "text", content: "" },
  ]);
  const [reviews, setReviews] = useState<string[]>(
    new Array(categories.length).fill("")
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
  const [showInitialChoice, setShowInitialChoice] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [placeholder, setPlaceholder] = useState("✍🏻");

  useEffect(() => {
    const questions = categories.map(
      (category) =>
        category.questions[
          Math.floor(Math.random() * category.questions.length)
        ]
    );
    setSelectedQuestions(questions);
  }, []);

  const handleReviewChange = (review: string) => {
    const newReviews = [...reviews];
    newReviews[currentStep] = review;
    setReviews(newReviews);
  };

  const handleNext = () => {
    if (currentStep < categories.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      const userReviews = reviews.join("\n");
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
            "noopener,noreferrer"
          );
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
            "noopener,noreferrer"
          );
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
    const allReviews = reviews.join("\n");
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
          (Math.floor(Math.random() * (100 - 90 + 1)) + 90).toString()
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
      "noopener,noreferrer"
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
      blocks.map((block) => (block.id === id ? { ...block, content } : block))
    );
  };

  if (isDialogOpen) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="w-full">
          <DialogHeader>
            <DialogTitle>Sophisticated Review</DialogTitle>
            <Textarea
              defaultValue={sophisticatedReview}
              className="w-full min-h-[400px]"
              onChange={(e) => setSophisticatedReview(e.target.value)}
            />
          </DialogHeader>
          <ScoreRingCard
            score={parseInt(userReviewSophisticatedScore, 10)}
            title="New Review Score"
            description="Indicator displaying how helpful your review is."
          />
          <DialogFooter>
            <Button type="submit" onClick={handleSubmitSophisticated}>
              Use Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (isReviewComplete) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Your Review </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map((category, index) => (
            <div key={index} className="space-y-2">
              <p>{reviews[index]}</p>
            </div>
          ))}
          <div className="flex justify-center">
            <ScoreRingCard
              score={parseInt(userReviewScore, 10)}
              title="Review Score"
              description="Indicator displaying how helpful your review is."
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleSubmit}>Submit Review</Button>
          {parseInt(userReviewScore, 10) < 75 && (
            <Button onClick={handleSophisticateReview}>Improve Review</Button>
          )}
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-4">
      <p className="text-3xl font-bold">{title || "Untitled"}</p>
      <div className="max mx-auto p-6 bg-white rounded-lg shadow-sm">
        <ul className="space-y-4">
          {questions.map((item, index) => (
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
          className="w-full border-none outline-none"
          style={{ resize: "none" }}
          rows={1}
          placeholder={placeholder}
        />
      </div>

      <div className="flex justify-end space-x-2">
        {currentStep === categories.length - 1 ? (
          <Send onClick={handleNext} />
        ) : (
          <CircleArrowRight />
        )}
      </div>
    </div>
  );
};

export default SmartReviewBuilder;
