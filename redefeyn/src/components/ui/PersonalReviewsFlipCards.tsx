"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { PersonalReviewInfoFromSerializer } from "../Types/types";

function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function ReviewCard({ review }: { review: PersonalReviewInfoFromSerializer }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div className="w-full h-[400px] [perspective:1000px]">
      <div
        className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] cursor-pointer ${
          isFlipped ? "[transform:rotateY(180deg)]" : ""
        }`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front of the card */}
        <Card className="absolute w-full h-full [backface-visibility:hidden]">
          <CardHeader className="flex flex-col items-center h-full">
            <CardTitle className="text-2xl mb-2">{review.location}</CardTitle>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < review.rating
                      ? "text-primary fill-primary"
                      : "text-muted"
                  }`}
                />
              ))}
            </div>
            <p className="text-muted-foreground">{review.review_date}</p>
            {review.score_received !== null &&
              review.score_received !== undefined && (
                <Badge
                  className={cn(
                    "bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium mt-2",
                  )}
                >
                  {"Vero Points: "}
                  {review.score_received}
                </Badge>
              )}
            <Separator />
            <div className="flex flex-col items-start w-full">
              <h3 className="text-lg font-semibold mb-2">Badges</h3>
              <div className="flex flex-wrap gap-2 w-full">
                {review.posted_with_bubble_rating_platform &&
                review.badges.length > 0 ? (
                  (review.badges as any).map((badge: string, index: number) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-white text-black"
                    >
                      {badge}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-muted-foreground">
                    {review.posted_with_bubble_rating_platform
                      ? "No badges available"
                      : "Free form platform was used"}
                  </span>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Back of the card */}
        <Card className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-auto">
          <CardContent className="grid gap-4 p-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Review Analysis</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(review.analyzed_review_details).length !== 0 && (
                  <>
                    <Badge variant="outline">
                      Emotion:{" "}
                      {capitalizeFirstLetter(
                        (review.analyzed_review_details as any).emotion,
                      )}
                    </Badge>
                    <Badge variant="outline">
                      Tone:{" "}
                      {capitalizeFirstLetter(
                        (review.analyzed_review_details as any).tone,
                      )}
                    </Badge>
                  </>
                )}
                <Badge variant="outline">
                  {review.pending_google_review
                    ? "Pending Review to Google: ⏳"
                    : review.posted_to_google_review
                      ? "Posted to Google: ✅"
                      : "Posted to Google: 🚫"}
                </Badge>
                <Badge variant="outline">
                  {review.posted_with_in_store_mode
                    ? "Kiosk Review: ✅"
                    : "Personal Device Review: ✅"}
                </Badge>
                {review.generated_review_body !== "" && (
                  <Badge variant="outline">AI-assisted review: ✅</Badge>
                )}
                <Badge variant="outline">
                  {review.email_sent_to_company
                    ? review.posted_with_in_store_mode
                      ? "Email Sent with Generated Review: ✅"
                      : "Email Sent to Address Concerns: ✅"
                    : "Email Sent: ❌"}
                </Badge>
              </div>
            </div>
            {(review.final_review_body.trim() !== "" ||
              review.generated_review_body.trim() !== "") && (
              <>
                <Separator />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Review Content</h3>
                  <p className="text-sm text-muted-foreground">
                    {review.final_review_body || review.generated_review_body}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PersonalReviewsFlipCards({
  reviews,
}: {
  reviews: PersonalReviewInfoFromSerializer[];
}) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    </div>
  );
}
