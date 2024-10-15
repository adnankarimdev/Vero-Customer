"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import RecordingLoader from "@/components/ui/Skeletons/RecordingLoader";
import VeroPointsBadge from "@/components/ui/VeroPointsBadge";

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
    <div className="flex items-center justify-center min-h-screen">
      {isLoading && <RecordingLoader />}
      {!isLoading && (
        <>
          <VeroPointsBadge score={customerScore} />
        </>
      )}
    </div>
  );
}
