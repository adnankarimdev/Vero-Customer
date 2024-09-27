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
        <div className="flex flex-col w-full h-full min-h-[400px]">
          <Textarea
            value={generatedReview}
            onChange={(e) => setGeneratedReview(e.target.value)}
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
