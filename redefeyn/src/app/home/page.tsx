"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SearchBar from "@/components/ui/SearchBar";
import axios from "axios";
import FlipCards from "@/components/ui/FlipCards";
import { useToast } from "@/hooks/use-toast";
import TypingEffect from "@/components/ui/TypingEffect";
import RecordingLoader from "@/components/ui/Skeletons/RecordingLoader";

// so we will create a new component here to open home page.
// we will get the data from the table backend_customerreviewinfo. Ideally, we will handle all the data processing in the backend.

export default function DuplicateReviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [locationData, setLocationData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [customerLocationsReviewed, setCustomerLocationsReviewed] = useState(
    [],
  );
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
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error(err);
        false;
      }
    };

    fetchData();
  }, []);
  return (
    <div className="space-y-8">
      {isLoading && <RecordingLoader />}
      {!isLoading && (
        <>
          <SearchBar />
          <FlipCards
            locations={locationData}
            customerLocationsReviewed={customerLocationsReviewed}
          />
        </>
      )}
    </div>
  );
}
