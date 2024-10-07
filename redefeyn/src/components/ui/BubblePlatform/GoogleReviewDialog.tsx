import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "../scroll-area";
import { Separator } from "../separator";
import { Badge } from "../badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea"; // import necessary components from your UI library
import { FcGoogle } from "react-icons/fc"; // if using Google icon

interface GoogleReviewDialogContentProps {
  isDialogOpen: boolean;
  generatedReview: string;
  setGeneratedReview: (review: string) => void;
  handlePostGeneratedReviewToGoogle: () => void;
  handleGoogleReviewDialogChange: (open: boolean) => void;
  allBadges?: string[];
}

const GoogleReviewDialogContent: React.FC<GoogleReviewDialogContentProps> = ({
  isDialogOpen,
  generatedReview,
  setGeneratedReview,
  handlePostGeneratedReviewToGoogle,
  handleGoogleReviewDialogChange,
  allBadges,
}) => {
  const [isChecked, setIsChecked] = useState(false); // state to track checkbox

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleGoogleReviewDialogChange}>
      <DialogContent className="w-full max-h-[80vh] overflow-y-auto sm:max-h-[none]">
        <DialogHeader>
          <DialogTitle className="text-center">
            Your review is ready to take the spotlight! 🌟
          </DialogTitle>
          <DialogDescription className="text-center">
            Feel free to edit this! Once it looks good, click the button below
            and it will copy the review for you to paste to Google 🥳
          </DialogDescription>
          <div className="flex flex-col w-full h-full min-h-[400px]">
            <Textarea
              value={generatedReview}
              onChange={(e) => setGeneratedReview(e.target.value)}
              rows={generatedReview.split("\n").length + 10}
              className="flex-grow resize-none mb-2"
              placeholder="Your generated review will appear here..."
            />
            <div className="bg-background border rounded-md p-2">
              <p className="text-xs font-medium text-center mb-2">
                Selected Badges at Time of Selection
              </p>
              <ScrollArea className="h-24">
                <div className="flex flex-wrap gap-2 justify-center">
                  {allBadges &&
                    allBadges.map((badge, index) => (
                      <Badge key={index} variant="outline">
                        {badge}
                      </Badge>
                    ))}
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="flex flex-col justify-between items-center">
          <div className="flex flex-col  justify-center items-center h-full w-full">
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
                I confirm this reflects my experience.
              </label>
            </div>
            <Button
              type="submit"
              onClick={handlePostGeneratedReviewToGoogle}
              variant="default"
              className="mt-4"
              disabled={!isChecked} // Disable the button if checkbox is not checked
            >
              Copy & Paste
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleReviewDialogContent;
