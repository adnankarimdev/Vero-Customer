"use client"
import { useState, useEffect } from "react";
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
    const [isLoading, setIsLoading] = useState(true);
    const [generatedReview, setGeneratedReview] = useState("");
    const [googleUrl, setGoogleUrl] = useState("")
    const { toast } = useToast();
    const pathname = usePathname();

    useEffect(() => {
        const reviewUuid = pathname.split("/").pop(); // Get the last part of the URL
        const fetchData = async () => {
            try {
                // Fetch the review data
                const reviewResponse = await axios.get(
                    `https://vero.ngrok.dev/backend/get-review-by-uuid/${reviewUuid}/`
                );
                console.log("my info", reviewResponse.data);
                setGeneratedReview(reviewResponse.data.review_body);
                setGoogleUrl(reviewResponse.data.google_review_url);
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
                                Feel free to edit this! Once it looks good, click the Google
                                icon below and it will copy the review for you to paste 🥳
                            </CardDescription>

                            <Textarea
                                defaultValue={generatedReview}
                                className="w-full min-h-[400px]"
                                onChange={(e) => setGeneratedReview(e.target.value)}
                            />
                        </CardHeader>
                        <CardFooter className="flex justify-center items-center">
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
    );
}