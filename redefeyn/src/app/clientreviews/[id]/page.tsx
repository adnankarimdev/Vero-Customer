"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SmartReviewBuilder from "@/components/ui/SmartReviewBuilder";

import TutorialSteps from "@/components/ui/TutorialSteps";
import { useParams } from 'next/navigation';

export default function Dashboard() {
  const [showReviewPlatform, setShowReviewPlatform] = useState(false);
  const { id } = useParams();

  const steps = [
    {
      title: "Step 1: Share Your Thoughts",
      description:
        "Quickly jot down your answers to questions by Phil & Sebastian, using your own unique style.",
      emoji: "✏️",
    },
    {
      title: "Step 2: Redefeyn",
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


  const handleGoToGoogleReview = () => {
    window.open(
      "https://search.google.com/local/writereview?placeid=ChIJzd0u2lRlcVMRoSTjaEEDL_E",
      "_blank",
      "noopener,noreferrer",
    );
  };

  const goToRedefeyn = () => {
    setShowReviewPlatform(true);
  };

  return (
    <div className="container mx-auto p-4">
      {!showReviewPlatform && (
        <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
          <Card className="w-auto max-w-2xl mx-auto mt-10">
            <CardHeader>
              <TutorialSteps steps={steps} />
              <CardTitle className="text-center">
                <Button
                  onClick={() => goToRedefeyn()}
                  className="w-full"
                  variant="link"
                >
                  Continue to Redefeyn
                </Button>
                <Button
                  onClick={handleGoToGoogleReview}
                  className="w-full"
                  variant="link"
                >
                  Go Directly to Google Review
                </Button>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      )}
      {showReviewPlatform && <SmartReviewBuilder id={ Number(id)}/>}
    </div>
  );
}
