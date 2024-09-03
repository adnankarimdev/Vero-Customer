"use client"

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SmartReviewBuilder from "@/components/ui/SmartReviewBuilder";
import { Place } from "@/components/Types/types";
import axios from "axios";
import TutorialSteps from "@/components/ui/TutorialSteps";
import { useParams } from "next/navigation";

export default function Dashboard() {
  const [showReviewPlatform, setShowReviewPlatform] = useState(false);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  
  // Initialize steps using useState
  const [steps, setSteps] = useState([
    {
      title: "Step 1: Share Your Thoughts",
      description:
        "Quickly jot down your answers to questions asked by the business, using your own unique style.",
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
  ]);

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

  useEffect(() => {
    const fetchReviewSettings = async (placeId = id) => {
      try {
        const response = await axios.get(
          `http://10.0.0.239:8021/backend/get-review-questions/${placeId}/`,
        );
        const reviewPlace = response.data.places.find((place: Place) => place.place_id === id);
        setTitle(reviewPlace.name);
        
        // Update steps state
        setSteps([
          {
            title: "Step 1: Share Your Thoughts",
            description:
              `Quickly jot down your answers to questions by ${reviewPlace.name}, using your own unique style.`,
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
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchReviewSettings();
  }, [id]); // Dependency on 'id'

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
      {showReviewPlatform && <SmartReviewBuilder id={id as string} />}
    </div>
  );
}