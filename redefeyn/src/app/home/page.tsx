"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SearchBar from "@/components/ui/SearchBar";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import FlipCards from "@/components/ui/FlipCards";
import { useToast } from "@/hooks/use-toast";
import { BadgeCheck, BadgeX } from "lucide-react";
import TypingEffect from "@/components/ui/TypingEffect";
import RecordingLoader from "@/components/ui/Skeletons/RecordingLoader";
import { Button } from "@/components/ui/button";

export default function DuplicateReviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [locationData, setLocationData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerLocationsReviewed, setCustomerLocationsReviewed] = useState(
    [],
  );
  const [isVeroCertified, setIsVeroCertified] = useState(false);

  const handleVeroCertifiedMessage = () => {
    const veroCertifiedStatus =
      Number(process.env.NEXT_PUBLIC_VERO_CERTIFIED_STATUS) || 0;
    if (!isVeroCertified) {
      toast({
        title: "Not Vero Certified.",
        description: `You need to visit ${veroCertifiedStatus - customerLocationsReviewed.length} more places to be certified. Get going & reviewing! 🏃`,
        duration: 3000,
      });
    } else {
      toast({
        title: "Vero Certified.",
        description: `You're one of our top Vero Reviewers! 🤗`,
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const reviewSettingsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-review-data-customer/`,
        );
        console.log(reviewSettingsResponse.data);
        setLocationData(reviewSettingsResponse.data);

        const email = localStorage.getItem("customerEmail");
        if (!email) {
          toast({
            title: "Please sign in.",
            duration: 3000,
          });
          router.push("/authentication");
          console.error("Email not found in localStorage");
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-customer-reviewed-places/${email}/`,
        );
        setCustomerLocationsReviewed(response.data.data);
        setIsVeroCertified(response.data.data.length > 5);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative space-y-4 p-4">
      {isLoading && <RecordingLoader />}
      {!isLoading && (
        <>
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start mb-4 sm:mb-0">
            {/* Badge */}
            <div className="flex justify-center sm:justify-start sm:absolute sm:top-4 sm:right-4 z-20">
              <Button
                variant="ghost"
                onClick={handleVeroCertifiedMessage}
                className="p-0 inline-flex items-center justify-center hover:bg-transparent hover:text-current focus:ring-0 active:bg-transparent"
              >
                <Badge variant="outline">
                  {"Vero Certified Reviewer: "}
                  <svg width="0" height="0">
                    <linearGradient
                      id="purple-gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop stopColor="#a855f7" offset="0%" />
                      <stop stopColor="#7e22ce" offset="100%" />
                    </linearGradient>
                  </svg>
                  {isVeroCertified ? (
                    <BadgeCheck
                      className="w-6 h-6 ml-2"
                      style={{ stroke: "url(#purple-gradient)" }}
                    />
                  ) : (
                    <BadgeX
                      className="w-6 h-6 ml-2"
                      style={{ stroke: "url(#purple-gradient)" }}
                    />
                  )}
                </Badge>
              </Button>
            </div>

            {/* Search Bar */}
            <div className="z-10 w-full sm:w-auto">
              <SearchBar />
            </div>
          </div>

          {/* Responsive FlipCards */}
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <FlipCards
              locations={locationData}
              customerLocationsReviewed={customerLocationsReviewed}
            />
          </div>
        </>
      )}
    </div>
  );
}
