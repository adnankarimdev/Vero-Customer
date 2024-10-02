"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import copy from "copy-to-clipboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import EmailSkeleton from "@/components/ui/Skeletons/EmailSkeleton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import RecordingLoader from "@/components/ui/Skeletons/RecordingLoader";

export default function AtHomeCustomerReview() {
  const [isLoading, setIsLoading] = useState(true);
  const [generatedReview, setGeneratedReview] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [reviewUuidFromUrl, setReviewUuidFromUrl] = useState("");
  const [badges, setBadges] = useState([]);
  const [tone, setTone] = useState("");
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const reviewUuid = pathname.split("/").pop(); // Get the last part of the URL
    if (reviewUuid) {
      setReviewUuidFromUrl(reviewUuid);
    }
    const fetchData = async () => {
      try {
        // Fetch the review data
        const reviewResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-review-by-uuid/${reviewUuid}/`,
        );
        if (reviewResponse.data.posted_to_google) {
          router.push("/duplicatereview");
        }
        setGeneratedReview(reviewResponse.data.review_body);
        setGoogleUrl(reviewResponse.data.google_review_url);
        setTone(reviewResponse.data.tone);
        setBadges(JSON.parse(reviewResponse.data.badges));
      } catch (err) {
        console.error(err);
      } finally {
        // Ensure this runs regardless of success or failure
        setIsLoading(false);
      }
    };
    fetchData();
  }, [pathname]); // Dependency on pathname to fetch data when it changes

  const handlePostGeneratedReviewToGoogle = async () => {
    copy(generatedReview);
    setIsLoading(true);

    await axios
      .post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/update-review-data/`,
        {
          reviewUuid: reviewUuidFromUrl,
          finalReviewBody: generatedReview,
        },
      )
      .then((response) => {})
      .catch((error) => {
        //  setIsLoading(false);
      });
    // Simulate processing delay if needed
    setTimeout(() => {
      toast({
        title: "Your text is ready to paste!",
        description:
          "Your review has been copied to the clipboard! You can now paste it into the Google review form.",
        duration: 1000,
      });
      setIsLoading(false);
      window.location.href = googleUrl;
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      {isLoading ? (
        <RecordingLoader />
      ) : (
        <Card>
          <CardContent className="w-full">
            <CardHeader>
              <CardTitle className="text-center">
                Your review is ready to take the spotlight! 🌟
              </CardTitle>
              <CardDescription className="text-center">
                Feel free to edit this! Once it looks good, click the button
                below and it will copy the review for you to paste to Google 🥳
                <p className="text-gray-500 text-xs mt-2">
                  Tone at Time of Selection:{" "}
                  <span className="font-bold">
                    {tone.charAt(0).toUpperCase() + tone.slice(1)}
                  </span>
                </p>
              </CardDescription>

              <div className="flex flex-col w-full h-full min-h-[400px]">
                <Textarea
                  value={generatedReview}
                  onChange={(e) => setGeneratedReview(e.target.value)}
                  className="flex-grow resize-none mb-2"
                  rows={20}
                  placeholder="Your generated review will appear here..."
                />
                <div className="bg-background border rounded-md p-2">
                  <p className="text-xs font-medium text-center mb-2">
                    Selected Badges at Time of Selection
                  </p>
                  <ScrollArea className="h-24">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {badges.map((badge, index) => (
                        <Badge key={index} variant="outline">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-end items-center">
              <Button
                type="submit"
                onClick={handlePostGeneratedReviewToGoogle}
                variant="default"
              >
                Copy & Paste
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
