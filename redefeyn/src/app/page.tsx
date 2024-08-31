"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SmartReviewBuilder from "@/components/ui/SmartReviewBuilder";

import TutorialSteps from "@/components/ui/TutorialSteps";
// import SmartReviewBuilderNew from "@/components/ui/SmartReviewBuilderNew";

export default function Dashboard() {
  const [showReviewPlatform, setShowReviewPlatform] = useState(false);

  const steps = [
    {
      title: "Step 1: Share Your Thoughts",
      description:
        "Quickly jot down your answers to questions by Phil & Sebastian, using your own unique style.",
      emoji: "✏️",
    },
    {
      title: "Step 2: See the Magic",
      description:
        "If you want, Redefeyn will enhance your response, making sure it's the best it can be based on what you wrote!",
      emoji: "✨",
    },
    {
      title: "Step 3: Submit Your Review",
      description:
        "Once you're happy with it, send off your polished Google review!",
      emoji: "🚀",
    },
  ];

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchQueryGpt, setSearchQueryGpt] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [returnedGraph, setReturnedGraph] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleGoToGoogleReview = () => {
    window.open(
      "https://search.google.com/local/writereview?placeid=ChIJzd0u2lRlcVMRoSTjaEEDL_E",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const goToRedefeyn = () => {
    setShowReviewPlatform(true);
  };

  return (
    <div className="container mx-auto p-4">
          {!showReviewPlatform && (
            <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
  {/* Tutorial Steps Component */}
  <TutorialSteps steps={steps} />

  {/* Card Component */}
  <Card className="w-auto max-w-2xl mx-auto mt-10">
    <CardHeader>
      <CardTitle className="text-center">
        Choose Your Review Method
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <Button onClick={() => goToRedefeyn()} className="w-full">
        Continue to Redefeyn
      </Button>
      <Button onClick={handleGoToGoogleReview} className="w-full">
        Go Directly to Google Review
      </Button>
    </CardContent>
  </Card>
</div>
          )}
          {showReviewPlatform && <SmartReviewBuilder />}
    </div>
  );
}
