"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import SearchBar from "@/components/ui/SearchBar";
import axios from "axios";
import FlipCards from "@/components/ui/FlipCards";
import { useToast } from "@/hooks/use-toast";
import TypingEffect from "@/components/ui/TypingEffect";
import RecordingLoader from "@/components/ui/Skeletons/RecordingLoader";
import PersonalReviewsFlipCards from "@/components/ui/PersonalReviewsFlipCards";
import { PersonalReviewInfoFromSerializer } from "@/components/Types/types";

// so we will create a new component here to open home page.
// we will get the data from the table backend_customerreviewinfo. Ideally, we will handle all the data processing in the backend.

export default function DuplicateReviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [locationData, setLocationData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [personalReviews, setPersonalReviews] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-personal-reviews/${email}/`,
        );
        const data = response.data as PersonalReviewInfoFromSerializer[];
        const updatedReviews = data.map((review) => {
          // Convert badges JSON string to array or empty array if invalid
          const badgesArray = review.badges ? JSON.parse(review.badges) : [];
          return {
            ...review,
            badges: Array.isArray(badgesArray) ? badgesArray : [],
          };
        });
        setPersonalReviews(updatedReviews.reverse() as any);
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
    <div className="container mx-auto p-4">
      {isLoading && <RecordingLoader />}
      {!isLoading && (
        <>
          <SearchBar />
          {personalReviews.length > 0 ? (
            <PersonalReviewsFlipCards reviews={personalReviews} />
          ) : (
            <div className="flex items-center justify-center h-screen">
              <p className="text-center">
                All your personal reviews will appear here.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
