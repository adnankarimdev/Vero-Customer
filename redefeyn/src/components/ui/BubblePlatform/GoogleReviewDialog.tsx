import React, { useState } from "react";
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

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

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
            Build & Edit! Once it looks good, click the button below and it will
            copy the review for you to paste to Google 🥳
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col w-full h-full min-h-[400px]">
            <div className="flex flex-grow gap-4">
              <Textarea
                value={generatedReview}
                onChange={(e) => setGeneratedReview(e.target.value)}
                rows={generatedReview.split("\n").length + 10}
                className="flex-grow resize-none mb-2"
              />
              <div className="bg-background border rounded-md p-2 w-1/3">
                <p className="text-xs font-medium text-center mb-2">
                  Vibes felt Today
                </p>
                <ScrollArea className="h-auto">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {allBadges &&
                      allBadges.map((badge, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="bg-blue-500 text-white"
                        >
                          {badge}
                        </Badge>
                      ))}
                  </div>
                </ScrollArea>
              </div>
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
              onClick={handlePostGeneratedReviewToGoogle}
              variant="default"
              className="mt-4"
              disabled={!isChecked}
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
