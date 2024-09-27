import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "../scroll-area";
import { Separator } from "../separator";
import { Badge } from "../badge";
// import your dialog components
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
}) => (
  <Dialog open={isDialogOpen} onOpenChange={handleGoogleReviewDialogChange}>
    <DialogContent className="w-full">
      <DialogHeader>
        <DialogTitle className="text-center">
          Your review is ready to take the spotlight! 🌟
        </DialogTitle>
        <DialogDescription className="text-center">
          Feel free to edit this! Once it looks good, click the button below and
          it will copy the review for you to paste 🥳
        </DialogDescription>
        <div className="flex space-x-4">
          {" "}
          {/* Add flex container with spacing */}
          <ScrollArea className="max-h-72 w-48 rounded-md border flex-none border-none">
            {" "}
            {/* Keep fixed width for the scroll area */}
            <div className="p-4">
              <p className="mb-4 text-xs font-medium leading-none text-center">
                {"Selected Badges"}
              </p>
              {allBadges &&
                allBadges.length > 0 &&
                allBadges.map((badge) => (
                  <>
                    {" "}
                    {/* Use React.Fragment for proper key */}
                    <Badge variant="outline">{badge}</Badge>
                    <Separator className="my-2 border-none" />
                  </>
                ))}
            </div>
          </ScrollArea>
          <Textarea
            defaultValue={generatedReview}
            className="w-full min-h-[400px] flex-1" // Allow the textarea to grow and fill available space
            onChange={(e) => setGeneratedReview(e.target.value)}
          />
        </div>
      </DialogHeader>
      <DialogFooter className="flex justify-between items-center">
        <Button
          type="submit"
          onClick={handlePostGeneratedReviewToGoogle}
          variant="default"
        >
          Copy & Paste
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default GoogleReviewDialogContent;
