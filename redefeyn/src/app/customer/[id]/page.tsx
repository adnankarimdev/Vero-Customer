"use client";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import copy from "copy-to-clipboard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Inter } from "next/font/google";
import AnimatedLayout from "@/animations/AnimatedLayout";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import QuickAuthPage from "@/components/ui/QuickAuthPage";
import { Checkbox } from "@/components/ui/checkbox";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import RecordingLoader from "@/components/ui/Skeletons/RecordingLoader";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { AnimatedBeamTransition } from "@/components/ui/AnimatedBeamTransition";

const inter = Inter({ subsets: ["latin"] });

export default function AtHomeCustomerReview() {
  const [isLoading, setIsLoading] = useState(true);
  const [isChecked, setIsChecked] = useState(false); // state to track checkbox
  const [generatedReview, setGeneratedReview] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [reviewUuidFromUrl, setReviewUuidFromUrl] = useState("");
  const [badges, setBadges] = useState([]);
  const [tone, setTone] = useState("");
  const { toast } = useToast();
  const pathname = usePathname();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [localCustomerEmail, setLocalCustomerEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [sentences, setSentences] = useState([]);
  const [copyPasteClicked, setCopyPasteClicked] = useState(false);
  const [translateX, setTranslateX] = useState(0);
  const [showAnimatedBeam, setShowAnimatedBeam] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const contentWidth = content.offsetWidth;
    const containerWidth = container.offsetWidth;

    const animate = () => {
      setTranslateX((prevTranslateX) => {
        const newTranslateX = prevTranslateX - 1;
        return newTranslateX <= -contentWidth / 2 ? 0 : newTranslateX;
      });
    };

    const animationId = setInterval(animate, 30); // Adjust speed here

    return () => clearInterval(animationId);
  }, [badges]);

  const renderBadges = () => {
    if (badges) {
      return badges.concat(badges).map((badge, index) => (
        <Badge
          key={index}
          variant="outline"
          className="bg-blue-500 text-white text-xs py-0.5 px-2 mx-1 whitespace-nowrap"
        >
          {badge}
        </Badge>
      ));
    }
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    const reviewUuid = pathname.split("/").pop(); // Get the last part of the URL
    if (reviewUuid) {
      setReviewUuidFromUrl(reviewUuid);
    }
    const email = localStorage.getItem("customerEmail");
    if (email) {
      setLocalCustomerEmail(email);
    }
    const fetchData = async () => {
      try {
        // Fetch the review data
        const reviewResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/backend/get-review-by-uuid/${reviewUuid}/`,
        );
        if (reviewResponse.data.posted_to_google) {
          // router.push("/duplicatereview");
        }
        setTempEmail(reviewResponse.data.email);
        // setGeneratedReview(reviewResponse.data.review_body);
        setSentences(JSON.parse(reviewResponse.data.review_body)["sentences"]);
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
    setShowAnimatedBeam(true);

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
        duration: 2000,
      });
      setIsLoading(false);
      window.location.href = googleUrl;
    }, 2000);
  };

  useEffect(() => {
    if (generatedReview.length < 10) {
      setIsChecked(false);
    }
  }, [generatedReview.length]);

  return (
    <AnimatedLayout>
      <div className="flex items-center justify-center min-h-screen">
        {showAnimatedBeam ? (
          <AnimatedBeamTransition />
        ) : (
          <Card className="w-full h-full max-w-3xl mx-auto rounded-none border-0 shadow-none">
            <CardContent className="w-full">
              <CardHeader>
                <CardTitle className="text-center">
                  Your review is ready to take the spotlight! 🌟
                </CardTitle>
                {
                  <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
                    <DrawerTrigger>
                      {/* can we always assume the email sent and logged in is the same email?
                    might want to add a condition regarding it.  */}
                      {
                        <Badge
                          className={cn(
                            "bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium mt-2 mb-2",
                          )}
                        >
                          {`Sign up/Log in `}
                          {tempEmail != "" && (
                          <span className="text-black ml-1 mr-1">
                          {"as "}{tempEmail}
                        </span>
                          )}

                          {`to Receive Vero Points: 1 `}
                        </Badge>
                      }
                    </DrawerTrigger>
                    <DrawerContent className="items-center">
                      <DrawerHeader>
                        <DrawerTitle>
                          Get rewarded for your reviews!
                        </DrawerTitle>
                        <DrawerDescription>
                          You'll get 1 Vero Point for posting this to google.
                        </DrawerDescription>
                      </DrawerHeader>
                      <QuickAuthPage
                        setCustomerEmail={setCustomerEmail}
                        onDrawerClose={handleDrawerClose}
                        customerEmail={tempEmail}
                      />
                      <DrawerFooter>
                        <DrawerClose>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                }
                <CardDescription className="text-center">
                  <div>
                    <span
                      className={`text-orange-500 mr-2 ${generatedReview.length > 10 ? "line-through" : ""}`}
                      style={{
                        textDecorationThickness:
                          generatedReview.length > 10 ? `${2}px` : "0px",
                        transition:
                          "text-decoration-thickness 0.3s ease-in-out",
                      }}
                    >
                      Build.
                    </span>
                    <span
                      className={`text-blue-500 mr-2 ${isChecked ? "line-through" : ""}`}
                      style={{
                        textDecorationThickness: isChecked ? `${2}px` : "0px",
                        transition:
                          "text-decoration-thickness 0.3s ease-in-out",
                      }}
                    >
                      Confirm.
                    </span>
                    <span
                      className={`text-violet-500 mr-2 ${copyPasteClicked ? "line-through" : ""}`}
                      style={{
                        textDecorationThickness: copyPasteClicked
                          ? `${2}px`
                          : "0px",
                        transition:
                          "text-decoration-thickness 0.3s ease-in-out",
                      }}
                    >
                      Copy.
                    </span>
                    <span
                      className={`text-emerald-500 ${copyPasteClicked ? "line-through" : ""}`}
                      style={{
                        textDecorationThickness: copyPasteClicked
                          ? `${2}px`
                          : "0px",
                        transition:
                          "text-decoration-thickness 0.3s ease-in-out",
                      }}
                    >
                      Paste.
                    </span>
                  </div>
                </CardDescription>

                <div className="flex flex-col w-full h-full min-h-[400px]">
                  <div className="flex justify-center mt-2">
                    <span className="bg-gradient-to-r from-purple-500 to-rose-400 text-xs font-medium text-center mb-2 bg-clip-text text-transparent">
                      Vibes felt During Visit
                    </span>
                  </div>
                  <div className="bg-background border rounded-md mb-4">
                    {" "}
                    <div
                      ref={containerRef}
                      className="relative overflow-hidden whitespace-nowrap"
                      role="region"
                      aria-live="polite"
                      aria-label="Scrolling vibes banner"
                    >
                      <div
                        ref={contentRef}
                        className="inline-block transition-transform duration-100 ease-linear mb-2"
                        style={{ transform: `translateX(${translateX}px)` }}
                      >
                        {renderBadges()}
                      </div>
                      <div
                        className="inline-block transition-transform duration-100 ease-linear mb-2"
                        style={{ transform: `translateX(${translateX}px)` }}
                      >
                        {renderBadges()}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-center mt-2">
                    {/* Non-editable label text */}
                    <span className="bg-gradient-to-r from-blue-500 to-emerald-300 text-xs font-medium text-center mb-2 bg-clip-text text-transparent">
                      {"Build & Type"}
                    </span>
                    <Textarea
                      value={generatedReview}
                      onChange={(e) => setGeneratedReview(e.target.value)}
                      rows={generatedReview.split("\n").length + 10}
                      className="flex-grow resize-none mb-2"
                    />
                  </div>
                  <span className="bg-gradient-to-r from-yellow-100 to-orange-900 text-xs font-medium text-center mt-2 bg-clip-text text-transparent">
                    Review Helper
                  </span>
                  <div className="bg-background border rounded-md p-2 mt-2">
                    <ScrollArea className="h-auto">
                      <div className="flex flex-wrap gap-2 justify-center">
                        {sentences &&
                          sentences.length > 0 &&
                          sentences.map((sentence, index) => (
                            <Badge
                              key={index}
                              className={`bg-green-500 text-white ${inter.className}`}
                              onClick={() =>
                                setGeneratedReview(
                                  ((prev: any) => prev + " " + sentence) as any,
                                )
                              }
                            >
                              {sentence}
                            </Badge>
                          ))}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </CardHeader>
              <CardContent></CardContent>
              <CardFooter className="flex flex-col justify-between items-center">
                <div className="flex flex-col  justify-center items-center h-full w-full">
                  <div className="flex items-center">
                    <Checkbox
                      id="terms"
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        setIsChecked(checked === true)
                      }
                      className="mr-4"
                    />
                    <label
                      htmlFor="terms"
                      className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I confirm this reflects my experience.
                    </label>
                  </div>
                  <RainbowButton
                    type="submit"
                    onClick={() => {
                      setCopyPasteClicked(true);
                      handlePostGeneratedReviewToGoogle();
                    }}
                    // variant="default"
                    className="mt-4 px-2 py-[-2] text-xs"
                    disabled={!(isChecked && generatedReview.length > 10)}
                  >
                    Copy & Paste to Google
                  </RainbowButton>
                  {/* <Button
                    type="submit"
                    onClick={() => {
                      setCopyPasteClicked(true);

                      setTimeout(() => {
                        handlePostGeneratedReviewToGoogle();
                      }, 1000);
                    }}
                    variant="default"
                    className="mt-4"
                    disabled={!(isChecked && generatedReview.length > 10)} // Disable the button if checkbox is not checked
                  >
                    Copy & Paste
                  </Button> */}
                </div>
              </CardFooter>
            </CardContent>
          </Card>
        )}
      </div>
    </AnimatedLayout>
  );
}
