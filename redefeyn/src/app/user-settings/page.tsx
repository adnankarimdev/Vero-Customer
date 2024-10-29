"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import RecordingLoader from "@/components/ui/Skeletons/RecordingLoader";
import VeroPointsBadge from "@/components/ui/VeroPointsBadge";
import RewardPack from "@/components/ui/RewardPack";
import VeroGlobalBadge from "@/components/ui/VeroGlobalBadge";
import UserSettings from "@/components/ui/UserSettings";
import { UserSerializer } from "@/components/Types/types";

export default function DuplicateReviewPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [customerScore, setCustomerScore] = useState(0);
  const [userInformation, setUserInformation] = useState<Partial<UserSerializer>>({});

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
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-customer-information/${email}/`,
        );
        console.log(response.data.data)
        setUserInformation(response.data.data)
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
            
          </div>

          {/* RewardPack centered on the page, responsive layout */}
          <div className="flex flex-col items-center justify-center min-h-screen">
            {/* Centered Badge */}
            <div className="mb-4">{/* <VeroGlobalBadge score={500} /> */}</div>

            {/* Reward Packs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <UserSettings userInformation={userInformation}/>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
