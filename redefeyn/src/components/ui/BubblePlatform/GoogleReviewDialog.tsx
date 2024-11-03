import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
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
import { Checkbox } from "@/components/ui/checkbox";
import QuickAuthPage from "../QuickAuthPage";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Inter } from "next/font/google";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FcGoogle } from "react-icons/fc";

interface GoogleReviewCardProps {
  isDialogOpen?: boolean;
  generatedReview: string;
  handleGoogleReviewDialogChange: (open: boolean) => void;
  setGeneratedReview: (review: string) => void;
  handlePostGeneratedReviewToGoogle: () => void;
  allBadges?: string[];
  customerEmail?: string;
  setCustomerEmail?: (email: string) => void;
  inStoreMode?: boolean;
  generatedSentences?: string[];
}
const inter = Inter({ subsets: ["latin"] });

const GoogleReviewCard: React.FC<GoogleReviewCardProps> = ({
  isDialogOpen,
  handleGoogleReviewDialogChange,
  generatedReview,
  setGeneratedReview,
  handlePostGeneratedReviewToGoogle,
  allBadges,
  customerEmail,
  setCustomerEmail,
  inStoreMode,
  generatedSentences,
}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [copyPasteClicked, setCopyPasteClicked] = useState(false);
  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  const [translateX, setTranslateX] = useState(0);
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
  }, [allBadges]);

  const renderBadges = () => {
    if (allBadges) {
      return allBadges.concat(allBadges).map((badge, index) => (
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

  useEffect(() => {
    if (generatedReview.length < 10) {
      setIsChecked(false);
    }
  }, [generatedReview.length]);
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full h-full max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">
            Your review is ready to take the spotlight! 🌟
          </CardTitle>
          {!inStoreMode && customerEmail === "" && (
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <div className="w-fit mx-auto flex items-center justify-center">
                  <Badge
                    className={cn(
                      "bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium mt-2 mb-2 cursor-pointer",
                    )}
                  >
                    Sign up/Log in to Receive Vero Points: 1
                  </Badge>
                </div>
              </DrawerTrigger>
              <DrawerContent className="items-center">
                <DrawerHeader>
                  <DrawerTitle>Get rewarded for your reviews!</DrawerTitle>
                  <DrawerDescription>
                    {"You'll get 1 Vero Point for posting this to Google."}
                  </DrawerDescription>
                </DrawerHeader>
                <QuickAuthPage
                  setCustomerEmail={setCustomerEmail}
                  onDrawerClose={handleDrawerClose}
                />
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
          <CardDescription className="text-center">
            <div>
              <span
                className={`text-orange-500 mr-2 ${generatedReview.length > 10 ? "line-through" : ""}`}
                style={{
                  textDecorationThickness:
                    generatedReview.length > 10 ? `${2}px` : "0px",
                  transition: "text-decoration-thickness 0.3s ease-in-out",
                }}
              >
                Build.
              </span>
              <span
                className={`text-blue-500 mr-2 ${isChecked ? "line-through" : ""}`}
                style={{
                  textDecorationThickness: isChecked ? `${2}px` : "0px",
                  transition: "text-decoration-thickness 0.3s ease-in-out",
                }}
              >
                Confirm.
              </span>
              <span
                className={`text-violet-500 mr-2 ${copyPasteClicked ? "line-through" : ""}`}
                style={{
                  textDecorationThickness: copyPasteClicked ? `${2}px` : "0px",
                  transition: "text-decoration-thickness 0.3s ease-in-out",
                }}
              >
                Copy.
              </span>
              <span
                className={`text-emerald-500 ${copyPasteClicked ? "line-through" : ""}`}
                style={{
                  textDecorationThickness: copyPasteClicked ? `${2}px` : "0px",
                  transition: "text-decoration-thickness 0.3s ease-in-out",
                }}
              >
                Paste.
              </span>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col w-full h-full min-h-[400px]">
            <div className="bg-background border rounded-md mb-4">
              {" "}
              <div className="flex justify-center mt-2">
                <span className="bg-gradient-to-r from-purple-500 to-purple-700 text-xs font-medium text-center mb-2 bg-clip-text text-transparent">
                  Vibes felt Today
                </span>
              </div>
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
            <div className="flex flex-grow gap-4">
              <Textarea
                value={generatedReview}
                onChange={(e) => setGeneratedReview(e.target.value)}
                rows={generatedReview.split("\n").length + 10}
                className="flex-grow resize-none mb-2"
              />
            </div>
            <div className="bg-background border rounded-md p-2 mt-4">
              <p className="text-xs font-medium text-center mb-2">
                Review Helper ✍🏻
              </p>
              <ScrollArea className="h-auto">
                <div className="flex flex-wrap gap-2 justify-center">
                  {generatedSentences &&
                    generatedSentences.length > 0 &&
                    generatedSentences.map((sentence, index) => (
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
        </CardContent>
        <CardFooter className="flex flex-col justify-between items-center">
          <div className="flex flex-col justify-center items-center h-full w-full">
            <div className="flex items-center">
              <Checkbox
                id="terms"
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(checked === true)}
                className="mr-4"
                disabled={generatedReview.length < 10}
              />
              <label
                htmlFor="terms"
                className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                I confirm this is my genuine experience.
              </label>
            </div>
            <Button
              type="submit"
              onClick={() => {
                setCopyPasteClicked(true);
                handlePostGeneratedReviewToGoogle();
              }}
              variant="default"
              className="mt-4"
              disabled={!(isChecked && generatedReview.length > 10)}
            >
              Copy & Paste to Google
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default GoogleReviewCard;
