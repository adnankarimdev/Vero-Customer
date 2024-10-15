"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import RecordingLoader from "@/components/ui/Skeletons/RecordingLoader";
import VeroPointsBadge from "@/components/ui/VeroPointsBadge";
import RewardPack from "@/components/ui/RewardPack";

export default function DuplicateReviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [customerLocationsReviewed, setCustomerLocationsReviewed] = useState(
    [],
  );
  const [customerScore, setCustomerScore] = useState(0);

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
          return;
        }
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-customer-score/${email}/`,
        );
        setCustomerScore(response.data.data);
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative min-h-screen">
      {isLoading && <RecordingLoader />}
      {!isLoading && (
        <>
          {/* VeroPointsBadge positioned in the top right */}
          <div className="absolute top-4 right-4">
            <VeroPointsBadge score={customerScore} />
          </div>

          {/* RewardPack centered on the page, responsive layout */}
          <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <RewardPack packTitle="Vero Food" packWorth={200} />
              <RewardPack packTitle="Vero Shop" packWorth={300} />
              <RewardPack packTitle="Vero Travel" packWorth={400} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}