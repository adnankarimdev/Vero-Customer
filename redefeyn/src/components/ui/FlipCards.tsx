"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Star, MapPinCheckInside } from "lucide-react";
import {
  LocationDataInfo,
  RatingSummary,
  LocationInfo,
  PersonalReviewInfoFromSerializer,
} from "../Types/types";
import { placeIcons } from "../Icons/icons";
import TimerBadge from "./TimerBadge";
import { isThreeDaysPassed } from "@/utils/time";

function LocationCard({
  location,
  placeReviewed,
  placesInfo,
  isLoyal,
  timeStamp,
}: {
  location: LocationDataInfo;
  placeReviewed?: boolean;
  placesInfo?: LocationInfo[][];
  isLoyal?: boolean;
  timeStamp?: string;
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

  function getLocationTypeIcon(searchName: string): JSX.Element | undefined {
    if (placesInfo) {
      for (const locationArray of placesInfo) {
        for (const location of locationArray) {
          if (location.name === searchName) {
            // Ensure googleTypes array exists and has at least one element
            if (location.googleTypes && location.googleTypes.length > 0) {
              const iconEntry = placeIcons.find(
                (iconObj) => iconObj.place === location.googleTypes[0],
              );
              if (iconEntry && iconEntry.icon) {
                const IconComponent = iconEntry.icon; // Get the icon component
                return <IconComponent size={16} />; // Render the component
              } else {
                return <MapPinCheckInside size={16} />; // Return a fallback JSX element
              }
            } else {
              return <MapPinCheckInside size={16} />; // Return JSX for missing googleTypes
            }
          }
        }
      }
      return undefined; // Return JSX for no matching location
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
          {/* Icon placement */}
          {getLocationTypeIcon(location.location) && (
            <div
              className={cn(
                // Centered below the title on small screens
                "flex justify-center mt-2",
                // Top-right for larger screens
                "md:absolute md:top-0 md:right-0 md:justify-end md:mt-2 mr-2",
              )}
            >
              {getLocationTypeIcon(location.location)}
            </div>
          )}
          {isLoyal == true && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Badge
                    className={cn(
                      "bg-rose-300 text-white font-medium mt-2 ml-2",
                    )}
                  >
                    Loyal
                  </Badge>
                </TooltipTrigger>
                <TooltipContent className="bg-white text-black border border-gray-200 shadow-md">
                  <p>
                    {`Loyalty is rare. `}
                    <span className="text-emerald-500">
                      {location.location}
                    </span>
                    {` knows you have it 👑`}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <div className="h-full flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="relative text-2xl mb-2 text-center">
                {/* Centered content */}
                {location.location}
              </CardTitle>
              <div className="flex flex-col items-center justify-center mb-2">
                <span className="ml-2">
                  {location.average_rating.toFixed(1)} / 5.0
                </span>
                <span className="ml-2">
                  {location.total_reviews} Vero Reviews
                </span>
                {placeReviewed == true &&
                  timeStamp &&
                  !isThreeDaysPassed(timeStamp) && (
                    <Badge
                      className={cn(
                        "bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium mt-2",
                      )}
                    >
                      {"Reviewed"}
                    </Badge>
                  )}
                {timeStamp && <TimerBadge timestamp={timeStamp} />}
                {placesInfo && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      location.location,
                    )}`}
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
                <div className="relative text-2xl mb-2 text-center">
                  {/* Centered content */}
                  {"Top Badges"}
                </div>
                {location.ratings_summary.map((summary, index) => (
                  <div key={index} className="mb-2">
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

export default function GroupedFlipCards({
  locations,
  customerLocationsReviewed,
  placesInfo,
  customerPersonalReviews,
  customerReviewTimes,
}: {
  locations: LocationDataInfo[];
  customerLocationsReviewed?: string[];
  placesInfo?: LocationInfo[][];
  customerPersonalReviews?: PersonalReviewInfoFromSerializer[];
  customerReviewTimes?: {};
}) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const groupedLocations = useMemo(() => {
    const groups: { [key: string]: LocationDataInfo[] } = {};
    locations.forEach((location) => {
      const type =
        placesInfo
          ?.find((infoArray) =>
            infoArray.find((info) => info.name === location.location),
          )
          ?.find((info) => info.name === location.location)?.googleTypes[0] ||
        "Other";

      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(location);
    });
    return groups;
  }, [locations, placesInfo]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-wrap gap-2 items-center justify-center">
        <Button
          variant="ghost"
          className="bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent"
        >
          <Badge
            onClick={() => setSelectedType(null)}
            className={cn(
              "font-small",
              selectedType === null
                ? "bg-blue-500 hover:bg-blue-600 text-white"
                : "bg-amber-500 hover:bg-amber-600 text-white",
            )}
          >
            All
          </Badge>
        </Button>
        {[
          ...Object.keys(groupedLocations)
            .filter((type) => type !== "Other")
            .map((type) => (
              <Button
                key={type}
                variant="ghost"
                className="bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent"
              >
                <Badge
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "font-small",
                    selectedType === type
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-amber-500 hover:bg-amber-600 text-white",
                  )}
                >
                  {type.replace("_", " ")}
                </Badge>
              </Button>
            )),
          Object.keys(groupedLocations).includes("Other") && (
            <Button
              key={0}
              variant="ghost"
              className="bg-transparent hover:bg-transparent active:bg-transparent focus:bg-transparent"
            >
              <Badge
                key="other"
                onClick={() => setSelectedType("Other")}
                className={cn(
                  "font-small",
                  selectedType === "Other"
                    ? "bg-blue-500 hover:bg-blue-600 text-white"
                    : "bg-amber-500 hover:bg-amber-600 text-white",
                )}
              >
                Other
              </Badge>
            </Button>
          ),
        ]}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(selectedType ? groupedLocations[selectedType] : locations).map(
          (location, id) => (
            <LocationCard
              key={id}
              location={location}
              placesInfo={placesInfo}
              placeReviewed={customerLocationsReviewed?.includes(
                location.place_id,
              )}
              timeStamp={
                customerReviewTimes &&
                (customerReviewTimes as { [key: string]: any })[
                  location.place_id
                ]
              }
              isLoyal={
                customerPersonalReviews &&
                customerPersonalReviews?.filter(
                  (item) => item.place_id_from_review === location.place_id,
                ).length > 2
              } //need at least 3 reviews to be considered loyal to a place
            />
          ),
        )}
      </div>
    </div>
  );
}
