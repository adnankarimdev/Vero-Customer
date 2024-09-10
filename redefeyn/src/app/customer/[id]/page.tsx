"use client"
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import copy from "copy-to-clipboard";
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
    const [isLoading, setIsLoading] = useState(false);
    const [generatedReview, setGeneratedReview] = useState("");
    const { toast } = useToast();
    const pathname = usePathname()

    useEffect(() => {
        setIsLoading(true)
        const reviewUuid = pathname.split("/").pop(); // Get the last part of the URL
        const fetchData = async () => {
            try {
              // First, fetch the placeId
              const reviewResponse = await axios.get(
                `https://vero.ngrok.dev/backend/get-review-by-uuid/${reviewUuid}/`
              );
              console.log("my info", reviewResponse.data);
            } catch (err) {
              console.error(err);
              setIsLoading(false)
            }
          };
      
          fetchData();
          setIsLoading(false)

      }, []);

      
    const handlePostGeneratedReviewToGoogle = async () => {
        // //send data to backend to process.
        // // copy immediately. If not, works janky on mobile browsers.
        // // Also, don't open a new tab. Direct them straight there.
        // // Saves us having to reload the page again. so all good!
        // copy(generatedReview);
        // setIsSendingEmail(true);

        // //need to update review with same review uuid
    
        // await axios
        //   .post("https://vero.ngrok.dev/backend/save-customer-review/", {
        //     data: dataToSave,
        //   })
        //   .then((response) => {
        //     setIsLoading(false);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //     setIsLoading(false);
        //   });
    
        // toast({
        //   title: "Your text is ready to paste!",
        //   description:
        //     "Your review has been copied to the clipboard! You can now paste it into the Google review form.",
        //   duration: 1000,
        // });
        // setTimeout(() => {
        //   window.location.href = reviewUrl;
        // }, 2000);
      };

    return(
        <div className="flex items-center justify-center min-h-screen">
      {isLoading && <RecordingLoader />}
      {!isLoading && (
        <Card>
        <CardContent className="w-full">
          <CardHeader>
            <CardTitle className="text-center">
              Your review is ready to take the spotlight! 🌟
            </CardTitle>
            <CardDescription className="text-center">
              Feel free to edit this! Once it looks good, click the Google
              icon below and it will copy the review for you to paste 🥳
            </CardDescription>

            <Textarea
                defaultValue={generatedReview}
                className="w-full min-h-[400px]"
                onChange={(e) => setGeneratedReview(e.target.value)}
            />
          </CardHeader>
          <CardFooter className="flex justify-between items-center">
            <Button
              type="submit"
              onClick={handlePostGeneratedReviewToGoogle}
              variant="ghost"
            >
              <FcGoogle size={24} />
            </Button>
          </CardFooter>
        </CardContent>
      </Card>
      )}

      </div>
    )
}