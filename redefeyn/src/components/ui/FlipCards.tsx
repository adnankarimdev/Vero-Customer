"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { LocationDataInfo, RatingSummary } from "../Types/types";

function LocationCard({ location }: { location: LocationDataInfo }) {
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
                <span className="ml-2">{location.average_rating}/5</span>
                {/* {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${
                  i < location.average_rating
                    ? "text-primary fill-primary"
                    : "text-muted"
                }`}
              />
            ))} */}
                <span className="ml-2">
                  {location.total_reviews} Vero Reviews
                </span>
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
}: {
  locations: LocationDataInfo[];
}) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location, id) => (
          <LocationCard key={id} location={location} />
        ))}
      </div>
    </div>
  );
}
