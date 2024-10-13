"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { LocationDataInfo, RatingSummary } from "../Types/types";

function LocationCard({
  location,
  placeReviewed,
}: {
  location: LocationDataInfo;
  placeReviewed?: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  return (
    <div
      className="w-full h-[400px] perspective-1000 cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? "rotate-y-180" : ""
        }`}
      >
        {/* Front of the card */}
        <Card className="w-full h-full overflow-hidden">
          <div className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-2xl mb-2 text-center">
                {location.location}
              </CardTitle>
              <div className="flex flex-col items-center justify-center mb-2">
                <span className="ml-2">
                  {location.average_rating.toFixed(1)} / 5.0
                </span>
                <span className="ml-2">
                  {location.total_reviews} Vero Reviews
                </span>
                {placeReviewed == true && (
                  <Badge
                    className={cn(
                      "bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium mt-2",
                    )}
                  >
                    {"Reviewed"}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <Separator className="mb-4" />
            <CardContent className="flex-grow overflow-auto">
              <div className="grid gap-4">
                {location.ratings_summary.map((summary, index) => (
                  <div key={index}>
                    <h4 className="text-lg mb-2">Rating: {summary.rating}</h4>
                    <div className="flex flex-wrap gap-2">
                      {summary.badges.map((badge, idx) => (
                        <Badge
                          key={idx}
                          className={`text-white ${
                            summary.rating === 5
                              ? "bg-green-500"
                              : summary.rating === 4
                                ? "bg-yellow-500"
                                : summary.rating === 3
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                          }`}
                        >
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Back of the card */}
        {/* <Card className="absolute w-full h-full backface-hidden rotate-y-180 overflow-auto">
          <CardContent className="grid gap-4">
            {location.ratings_summary.map((summary, index) => (
              <div key={index}>
                {summary.reviews.length > 0 && (
                  <div>
                    <h4 className="text-lg">Rating: {summary.rating}</h4>
                    <ul>
                      {summary.reviews.map((review, idx) => (
                        <li key={idx} className="rounded-lg p-4 shadow-sm">
                          <p className="text-sm text-muted-foreground">
                            {review}
                          </p>
                          <Separator className="mb-4" />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card> */}
      </div>
    </div>
  );
}

export default function FlipCards({
  locations,
  customerLocationsReviewed,
}: {
  locations: LocationDataInfo[];
  customerLocationsReviewed?: string[];
}) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location, id) => (
          <LocationCard
            key={id}
            location={location}
            placeReviewed={customerLocationsReviewed?.includes(
              location.place_id,
            )}
          />
        ))}
      </div>
    </div>
  );
}
