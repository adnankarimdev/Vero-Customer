"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import FlipCards from "@/components/ui/FlipCards";
import { useToast } from "@/hooks/use-toast";
import TypingEffect from "@/components/ui/TypingEffect";
import RecordingLoader from "@/components/ui/Skeletons/RecordingLoader";
import SearchBar from "@/components/ui/SearchBar";

// so we will create a new component here to open home page.
// we will get the data from the table backend_customerreviewinfo. Ideally, we will handle all the data processing in the backend.

export default function DuplicateReviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [locationData, setLocationData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [places, setPlaces] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const reviewSettingsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-review-data-customer/`,
        );
        setLocationData(reviewSettingsResponse.data);
        const placesInformation = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-place-information/`,
        );
        setPlaces(placesInformation.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error(err);
        false;
      }
    };

    fetchData();
  }, []);

  const onGetStarted = () => {
    router.push("/authentication");
  };
  return (
    <div className="space-y-8">
      {isLoading && <RecordingLoader />}
      {!isLoading && (
        <>
          <div className="flex justify-between items-center">
            <SearchBar />
            <Button
              variant="default"
              className="hidden md:inline-flex mr-2"
              onClick={onGetStarted}
            >
              Login
            </Button>
          </div>
          <FlipCards locations={locationData} placesInfo={places} />
        </>
      )}
    </div>
  );
}
