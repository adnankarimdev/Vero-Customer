"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { LocationDataInfo, RatingSummary, LocationInfo } from "../Types/types";

function LocationCard({
  location,
  placeReviewed,
  placesInfo,
}: {
  location: LocationDataInfo;
  placeReviewed?: boolean;
  placesInfo?: LocationInfo[][];
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  function getFormattedAddress(searchName: string): string | undefined {
    if (placesInfo) {
      for (const locationArray of placesInfo) {
        for (const location of locationArray) {
          if (location.name === searchName) {
            // just return formatted address if things look weird.
            return extractCityAndProvince(location.formatted_address);
          }
        }
      }
      return "No location found"; // return undefined if no match is found
    }
  }

  function extractCityAndProvince(address: string): string | undefined {
    // This regex assumes the format: "Street, City, Province PostalCode, Country"
    const regex = /,\s*([A-Za-z\s]+),\s*([A-Z]{2})\s/;
    const match = address.match(regex);

    if (match && match.length >= 3) {
      const city = match[1].trim(); // Capture the city name
      const province = match[2].trim(); // Capture the province or state code
      return city + ", " + province;
    }

    return undefined; // Return null if the pattern doesn't match
  }
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
                {placesInfo && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.location)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Badge
                      className={cn(
                        "bg-gradient-to-r from-blue-300 to-blue-500 text-white font-small mt-2",
                      )}
                    >
                      {getFormattedAddress(location.location)}
                    </Badge>
                  </a>
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
  placesInfo,
}: {
  locations: LocationDataInfo[];
  customerLocationsReviewed?: string[];
  placesInfo?: LocationInfo[][];
}) {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {locations.map((location, id) => (
          <LocationCard
            key={id}
            location={location}
            placesInfo={placesInfo}
            placeReviewed={customerLocationsReviewed?.includes(
              location.place_id,
            )}
          />
        ))}
      </div>
    </div>
  );
}
